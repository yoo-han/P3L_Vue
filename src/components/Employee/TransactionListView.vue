<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Daftar Transaksi
                    </h3>
                    <v-row justify="center">
                        <v-col cols="9" class="ps-10">
                            <v-card-title>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table v-model="selected" :headers="headers" :header-props="{ sortIcon: null }" :height="600" :items="transactions"
                                item-key="id_reservasi" :search="search" :single-select="true" show-select>
                                <template v-slot:[`item.bukti_transfer`]="{ item }">
                                    <div class="p-2">
                                    <v-avatar size="75">
                                        <v-img :src="$baseURL+'storage/'+item.bukti_transfer" max-width="100px"></v-img>
                                    </v-avatar>
                                    </div>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="3" style="padding-top:80px;">
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="green darken-2" @click="verificationTransaction(selected)">
                                    <v-icon x-large color="white"> mdi-check </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="grey darken-2" @click="updatePengembalian(selected)">
                                    <v-icon x-large color="white"> mdi-pencil </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="1" style="background:#251e3e" />
        </v-row>

        <v-dialog v-model="dialogVerif" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Konfirmasi Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select :items="availableDrivers" v-model="form.id_driver" label="Pilih Driver" item-value="id_driver" item-text="nama_driver" required>
                        </v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-4" text @click="konfirmasi(0)"> Tolak </v-btn>
                    <v-btn color="blue darken-4" text @click="konfirmasi(1)"> Konfirmasi </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogPengembalian" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Update Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field type="datetime-local" v-model="form.tanggal_kembali" label="Tanggal Pengembalian" required @change="dateChange"></v-text-field>
                        <v-text-field v-model="form.denda" label="Denda" disabled required></v-text-field>
                        <v-select :items="status" v-model="form.status_reservasi" label="Status" item-value="value" item-text="text" required></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="red darken-4" text @click="update"> Update </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom> {{ error_message }}</v-snackbar>
    </v-main>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Gothic+A1&family=Roboto&display=swap');

    .white--text {
        font-family: 'Roboto', sans-serif;
    }

    .subTitle {
        font-family: 'Roboto', sans-serif;
        font-size: 30pt;
        font-weight: bold;
        color: #251e3e;
    }

    .page {
        margin-top: 0px;
        align-items: start;
        justify-content: center;
        height: 100vh;
    }

    ::v-deep .v-data-table-header th{
        background-color: #251e3e;
        font-size: 14px !important;
    }

    ::v-deep .v-data-table-header th span{
        color: #ffffff;
    }
</style>

<script>
    import moment from "moment";
    export default {
        name: "List",
        data() {
            return {
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                headers: [{
                        text: "ID Transaksi",
                        sortable: true,
                        value: "id_reservasi",
                        align: "center",
                    },
                    {
                        text: "Nama Customer ",
                        value: "get_customer.nama_customer",
                        align: "center",
                    },
                    {
                        text: "Nama Mobil",
                        value: "get_mobil.nama_mobil",
                        align: "center",
                    },
                    {
                        text: "Nama Pegawai",
                        value: "get_pegawai.nama_pegawai",
                        align: "center",
                    },
                    {
                        text: "Kode Promo",
                        value: "get_promo.kode_promo",
                        align: "center",
                    },
                    {
                        text: "Nama Driver",
                        value: "get_driver.nama_driver",
                        align: "center",
                    },
                    {
                        text: "Tanggal Transaksi",
                        value: "tanggal_transaksi",
                        align: "center",
                    },
                    {
                        text: "Tanggal Mulai",
                        value: "tanggal_mulai",
                        align: "center",
                    },
                    {
                        text: "Tanggal Selesai",
                        value: "tanggal_selesai",
                        align: "center",
                    },
                    {
                        text: "Jenis Reservasi",
                        value: "jenis_reservasi",
                        align: "center",
                    },
                    {
                        text: "No. SIM",
                        value: "no_sim",
                        align: "center",
                    },
                    {
                        text: "Tarif Driver",
                        value: "tarif_driver",
                        align: "center",
                    },
                    {
                        text: "Metode Pembayaran",
                        value: "metode_pembayaran",
                        align: "center",
                    },
                    {
                        text: "Total Pembayaran",
                        value: "total_pembayaran",
                        align: "center",
                    },
                    {
                        text: "Bukti Transfer",
                        value: "bukti_transfer",
                        align: "center",
                    },
                    {
                        text: "Tanggal Pengembalian",
                        value: "tanggal_kembali",
                        align: "center",
                    },
                    {
                        text: "Denda",
                        value: "denda",
                        align: "center",
                    },
                    {
                        text: "Rating Driver",
                        value: "rating_driver",
                        align: "center",
                    },
                    {
                        text: "Status",
                        value: "status_reservasi",
                        align: "center",
                    },
                ],
                transaction: new FormData,
                transactions: [],
                singleSelect: true,
                selected: [],
                dialogVerif: false,
                dialogPengembalian: false,
                availableDrivers: [],
                form:{
                    id_pegawai:'',
                    id_driver:'',
                    tanggal_kembali:'',
                    denda:'',
                    status_reservasi:'',
                },
                currrent_date: null,
                datediff: 0,
                denda: 0,
                status: [
                    {value: 'Sudah Dikonfirmasi', text: 'Sudah Dikonfirmasi'},
                    {value: 'Belum Bayar Belum Verifikasi', text: 'Belum Bayar Belum Verifikasi'},
                    {value: 'Selesai', text: 'Selesai'},
                ],
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/reservasi';
                this.$http.get(url).then(response => {
                    this.transactions = response.data.data;
                })
            },

            readAvailableDriver() {
                var url = this.$api + '/availableDrivers';
                this.$http.get(url).then(response => {
                    this.availableDrivers = response.data.data;
                })
            },

            verificationTransaction(selected){
                if(selected.length != 0 ){
                    if(selected[0].status_reservasi == 'Menunggu Konfirmasi'){
                        this.dialogVerif = true;
                    }
                    else {
                        this.error_message = "Data telah dikonfirmasi!";
                        this.color = "red";
                        this.snackbar = true;
                        this.load = false;
                    }
                    
                }
                else {
                    this.error_message = "Pilih data yang ingin dikonfirmasi!";
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                }
                
            },

            konfirmasi(value){
                if(value == 1){
                    if(this.selected[0].jenis_reservasi == 'Penyewaan Mobil dan Driver'){
                        if(this.form.id_driver != ''){
                            let newData = {
                                id_pegawai : localStorage.getItem('id_employee'),
                                id_driver : this.form.id_driver,
                                status_reservasi : 'Sudah Dikonfirmasi',
                            };
                            
                            var url = this.$api + '/reservasi/' + this.selected[0].id_reservasi;
                            this.load = true;
                            this.$http.post(url, newData).then(response => {
                                this.error_message = response.data.message;
                                this.color = "green";
                                this.snackbar = true;
                                this.load = false;
                                this.readData();
                                this.cancel();
                                
                            }).catch(error => {
                                this.error_message = error.response.data.message;
                                this.color = "red";
                                this.snackbar = true;
                                this.load = false;
                            });
                        }
                        else {
                            this.error_message = "Pilih Driver!";
                            this.color = "red";
                            this.snackbar = true;
                            this.load = false;
                        }
                    } 
                    else {
                        let newData = {
                            id_pegawai : localStorage.getItem('id_employee'),
                            status_reservasi : 'Sudah Dikonfirmasi',
                        };
                        
                        var url = this.$api + '/reservasi/' + this.selected[0].id_reservasi;
                        this.load = true;
                        this.$http.post(url, newData).then(response => {
                            this.error_message = response.data.message;
                            this.color = "green";
                            this.snackbar = true;
                            this.load = false;
                            this.readData();
                            this.cancel();
                            
                        }).catch(error => {
                            this.error_message = error.response.data.message;
                            this.color = "red";
                            this.snackbar = true;
                            this.load = false;
                        });
                    }
                } 
                else {
                    let newData = {
                        status_reservasi : 'Ditolak',
                    };
                    var url = this.$api + '/reservasi/' + this.selected[0].id_reservasi;
                    this.load = true;
                    this.$http.post(url, newData).then(response => {
                        this.error_message = response.data.message;
                        this.color = "green";
                        this.snackbar = true;
                        this.load = false;
                        this.readData();
                        this.cancel();
                        
                    }).catch(error => {
                        this.error_message = error.response.data.message;
                        this.color = "red";
                        this.snackbar = true;
                        this.load = false;
                    });
                }
            },

            updatePengembalian(selected){
                if(selected.length != 0 ){
                    this.form.tanggal_kembali = this.selected[0].tanggal_kembali;
                    this.form.denda = this.selected[0].denda;
                    this.form.status_reservasi = this.selected[0].status_reservasi;
                    this.dialogPengembalian = true;
                }
                else {
                    this.error_message = "Pilih data yang ingin diubah!";
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                }
            },

            dateChange(date){
                this.currrent_date = moment(date).format('YYYY-MM-DD HH:mm:ss');
                let end = moment(this.currrent_date);
                let start = moment(this.selected[0].tanggal_selesai);
                let duration = moment.duration(end.diff(start));
                let hours = duration.asHours();
                if(hours%24 >= 3)
                    this.datediff = Math.round(duration.asDays())+1;
                else
                    this.datediff = Math.round(duration.asDays());
                if(this.datediff < 0)
                    this.denda = 0;
                else
                this.denda = this.datediff * this.selected[0].get_mobil.harga_sewa;
                this.form.denda = this.denda;
                console.log(this.denda);
            },

            update(){
                let newData = {
                    tanggal_kembali : this.currrent_date,
                    denda : this.form.denda,
                    status_reservasi : this.form.status_reservasi,
                };
                var url = this.$api + '/reservasi/' + this.selected[0].id_reservasi;
                this.load = true;
                this.$http.post(url, newData).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.readData();
                    this.cancel();
                    
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            cancel(){
                this.form = {
                    id_pegawai: '',
                    id_driver: '',
                    tanggal_kembali:'',
                    denda:'',
                    status_reservasi: '',
                }
                this.selected = [];
                this.dialogVerif = false;
                this.dialogPengembalian= false;
                this.currrent_date= null;
                this.datediff= 0;
                this.denda= 0;
            },
        },
        mounted() {
            this.readData();
            this.readAvailableDriver();
        },
    };
</script>