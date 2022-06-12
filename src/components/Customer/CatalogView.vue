<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Daftar Mobil
                    </h3>
                    <v-row class="justify-center">
                    <v-col 
                    cols="5"
                    v-for="item in cars"
                    :key="item.title"
                    >
                        <v-card class="mt-10 pb-1 px-2 mx-10 subTitle" style="background-color: #FFFfff"> 
                            <v-row class="justify-center mb-5">
                                <v-img
                                    :src="$baseURL+'storage/'+item.foto_mobil"
                                    contain
                                    height="300"
                                    max-width="400"
                                ></v-img>
                            </v-row>
                            <v-row class="mx-5 justify-center" align="center">
                                <p style="font-size:25pt">{{ item.nama_mobil }}</p>
                            </v-row>
                            <v-divider></v-divider>
                            <p class="my-4" style="font-size:15pt; font-weight:normal;">Spesifikasi Kendaraan</p>
                            <v-row align="center" justify="center" class="mx-2 my-4 px-10" style="font-size:15pt; font-weight:normal">
                                <div align="left">
                                    <table style="font-size:13pt">
                                        <tr>
                                            <th style="font-weight:bold; width:50%;"><v-icon>mdi-car</v-icon>Tipe Mobil</th>
                                            <td style="font-weight:normal; width:50%; text-align:center">{{item.tipe_mobil}}</td>
                                        </tr>
                                        <tr>
                                            <th style="font-weight:bold; width:50%"><v-icon>mdi-steering</v-icon>Jenis Transmisi</th>
                                            <td v-if="item.jenis_transmisi == 'AT'" style="font-weight:normal; width:50%; text-align:center">Automatic (AT)</td>
                                            <td v-else-if="item.jenis_transmisi == 'MT'" style="font-weight:normal; width:50%; text-align:center">Manual (MT)</td>
                                            <td v-else-if="item.jenis_transmisi == 'CVT'" style="font-weight:normal; width:50%; text-align:center">Continous Variable (CVT)</td>
                                        </tr>
                                        <tr>
                                            <th style="font-weight:bold; width:50%"><v-icon>mdi-format-color-fill</v-icon>Warna</th>
                                            <td style="font-weight:normal; width:50%; text-align:center">{{item.warna_mobil}}</td>
                                        </tr>
                                        <tr>
                                            <th style="font-weight:bold; width:50%"><v-icon>mdi-fuel</v-icon>Bahan Bakar</th>
                                            <td style="font-weight:normal; width:50%; text-align:center">{{item.jenis_bahan_bakar}}</td>
                                        </tr>
                                        <tr>
                                            <th style="font-weight:bold; width:50%"><v-icon>mdi-car-connected</v-icon>Fasilitas</th>
                                            <td style="font-weight:normal; width:50%; text-align:center">{{item.fasilitas}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row align="center" class="mx-2 my-4 px-10">
                                <h5>Rp{{ item.harga_sewa }},00</h5>
                                <v-spacer></v-spacer>
                                <v-btn @click="addReservation(item)" color="blue darken-1" class="white--text" style="width: 200px">
                                <v-icon>mdi-plus</v-icon>
                                Pesan
                                </v-btn>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
                </v-card>
            </v-col>
            <v-col cols="1" style="background:#251e3e" />
        </v-row>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Reservation</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="selected_car.nama_mobil" label="Nama Mobil" disabled required></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.tanggal_mulai" label="Tanggal Penyewaan Mulai" required @change="startDateChange"></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.tanggal_selesai" label="Tanggal Penyewaan Selesai" required @change="endDateChange"></v-text-field>
                        <v-select v-if="datediff >= 1" :items="jenisReservasi" v-model="form.jenis_reservasi" label="Jenis Reservasi" item-value="value" item-text="text" required @change="countSubtotalPeminjaman"></v-select>
                        <v-text-field v-if="form.jenis_reservasi == 'Penyewaan Mobil'" v-model="form.no_sim" label="Nomor Sim" required></v-text-field>
                        <v-text-field v-if="form.jenis_reservasi == 'Penyewaan Mobil dan Driver'" v-model="subTotalDriver" label="Tarif Driver" required disabled></v-text-field>
                        <v-select :items="availablePromos" v-model="form.id_promo" label="Promo" item-value="id_promo" item-text="kode_promo" required @change="countSubtotalPromo"></v-select>
                        <v-select :items="metodePembayaran" v-model="form.metode_pembayaran" label="Metode Pembayaran" item-value="value" item-text="text" required></v-select>
                        <p class="subTitle text-right" style="font-size:15pt">Total</p>
                        <p class="subTitle text-right">Rp{{subTotalUsingPromo}}</p>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-4" text @click="cancel"> Cancel </v-btn>
                    <v-btn v-if="datediff >= 1" color="blue darken-1" text @click="save"> Save </v-btn>
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

    .responsive-table {
        width: 100%;
        text-align: center;
        @media 
        only screen and (max-width: 760px) {

            table, thead, tbody, th, td, tr { 
                display: block; 
            }

            thead tr { 
                position: absolute;
                top: -9999px;
                left: -9999px;
            }

            tr {
                padding: 2rem 0;
            }

            
            td[data-label] {
                position: relative;
                padding-left: 40%; 
                display: flex;
                align-items: center;

                &:before { 
                    content: attr(data-label);
                    position: absolute;
                    top: 0.5rem;
                    left: 0;
                    width: 35%; 
                    padding-right: 10px; 
                    white-space: nowrap;
                    font-weight: bold;
                }
            }
        }
    }

    table, th, td {
        border: 1px solid #251e3e;
        border-collapse: collapse;
        font-family: 'Roboto', sans-serif;
        color: #251e3e;
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
                selected_index: -1,
                selected_car: [],
                cars: [],
                reservation: new FormData,
                dialog: false,
                formTitle:'',
                form:{
                    id_customer: '',
                    id_mobil: '', 
                    id_pegawai: '',
                    id_promo: '',
                    id_driver: '',
                    tanggal_transaksi: '',
                    tanggal_mulai: '',
                    tanggal_selesai: '',
                    jenis_reservasi: '',
                    no_sim: '',
                    tarif_driver: '',
                    metode_pembayaran: '',
                    bukti_transfer: '',
                    total_pembayaran: '',
                    tanggal_kembali: '',
                    denda: '',
                    rating_driver: '',
                    status_reservasi: '',
                },
                jenisReservasi: [
                    {value: 'Penyewaan Mobil', text: 'Penyewaan Tanpa Driver'},
                    {value: 'Penyewaan Mobil dan Driver', text: 'Penyewaan Dengan Driver'},
                ],
                metodePembayaran: [
                    {value: 'Transfer Bank', text: 'Transfer Bank'},
                    {value: 'Tunai', text: 'Tunai'},
                ],
                availablePromos: [],
                selectedPromo: [],
                start_date: null,
                end_date: null,
                datediff: 0,
                subTotalMobil: 0,
                subTotalDriver: 0,
                subTotal: 0,
                subTotalUsingPromo: 0,
                imageUrl: '',
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/catalog';
                this.$http.get(url).then(response => {
                    this.cars = response.data.data;
                })
            },

            tampilPromo() {
                var url = this.$api + '/promoByCust/' + localStorage.getItem('id_customer');
                this.$http.get(url).then(response => {
                    this.availablePromos = response.data.data;
                })
            },

            addReservation(item){
                this.formTitle = 'Tambah';
                this.selected_index = item.id_mobil;
                var url = this.$api + '/mobil/' + this.selected_index;
                this.$http.get(url).then(response => {
                    this.selected_car = response.data.data;
                })
                this.dialog = true;
            },

            save() {
                this.reservation.append('id_customer', localStorage.getItem('id_customer'));
                this.reservation.append('id_mobil', this.selected_car.id_mobil);
                this.reservation.append('id_promo', this.form.id_promo);
                this.reservation.append('tanggal_mulai', this.start_date);
                this.reservation.append('tanggal_selesai', this.end_date);
                this.reservation.append('jenis_reservasi', this.form.jenis_reservasi);
                if(this.form.jenis_reservasi == 'Penyewaan Mobil')
                    this.reservation.append('no_sim', this.form.no_sim);
                else{
                    this.reservation.append('tarif_driver', this.subTotalDriver);
                }
                this.reservation.append('metode_pembayaran', this.form.metode_pembayaran);
                this.reservation.append('total_pembayaran', this.subTotalUsingPromo);
                
                
                console.log(this.reservation)

                var url = this.$api + '/reservasi';
                this.load = true;

                this.$http.post(url, this.reservation).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                    this.readData();
                    this.cancel();
                    
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
                
                console.log(this.error_message)
            },

            cancel(){
                this.formTitle = '';
                this.form = {
                    id_customer: '',
                    id_mobil: '', 
                    id_pegawai: '',
                    id_promo: '',
                    id_driver: '',
                    tanggal_transaksi: '',
                    tanggal_mulai: '',
                    tanggal_selesai: '',
                    jenis_reservasi: '',
                    no_sim: '',
                    tarif_driver: '',
                    metode_pembayaran: '',
                    bukti_transfer: '',
                    total_pembayaran: '',
                    tanggal_kembali: '',
                    denda: '',
                    rating_driver: '',
                    status_reservasi: '',
                };
                this.reservation = new FormData;
                this.selected_index = -1;
                this.selected_car = [];
                this.dialog = false;
                this.start_date = null;
                this.end_date = null;
                this.datediff = 0;
                this.subTotalMobil = 0;
                this.subTotalDriver = 0;
                this.subTotal = 0;
                this.subTotalUsingPromo = 0;
                this.selectedPromo = [];
                this.imageUrl = '';
            },

            startDateChange(date){
                this.start_date = moment(date).format('YYYY-MM-DD HH:mm:ss');
                let end = moment(this.end_date);
                let start = moment(this.start_date);
                let duration = moment.duration(end.diff(start));
                let hours = duration.asHours();
                if(hours%24 >= 3)
                    this.datediff = Math.round(duration.asDays())+1;
                else
                    this.datediff = Math.round(duration.asDays());
            },

            endDateChange(date){
                this.end_date = moment(date).format('YYYY-MM-DD HH:mm:ss');
                let end = moment(this.end_date);
                let start = moment(this.start_date);
                let duration = moment.duration(end.diff(start));
                let hours = duration.asHours();
                if(hours%24 >= 3)
                    this.datediff = Math.round(duration.asDays())+1;
                else
                    this.datediff = Math.round(duration.asDays());
            },

            countSubtotalPeminjaman(selectObj) {
                if(selectObj == 'Penyewaan Mobil'){
                    this.subTotalMobil = this.countMultiplier(this.selected_car.harga_sewa);
                    this.subTotal = this.subTotalMobil;
                    if(this.selectedPromo.length != 0){
                        var temp = this.subTotal;
                        this.subTotalUsingPromo = temp*(100-this.selectedPromo.potongan_promo)/100;
                    }
                    else {
                        this.subTotalUsingPromo = this.subTotal;
                    }
                }
                else {
                    this.subTotalMobil = this.countMultiplier(this.selected_car.harga_sewa);
                    this.subTotalDriver = this.countMultiplier(50000);
                    this.subTotal = this.subTotalMobil + this.subTotalDriver;
                    if(this.selectedPromo.length != 0){
                        var temp = this.subTotal;
                        this.subTotalUsingPromo = temp*(100-this.selectedPromo.potongan_promo)/100;
                    }
                    else {
                        this.subTotalUsingPromo = this.subTotal;
                    }
                    
                }
            },

            countSubtotalPromo(selectObj) {
                this.selectedPromo = this.availablePromos.find(promo => promo.id_promo === selectObj);
                var temp = this.subTotal;
                this.subTotalUsingPromo = temp*(100-this.selectedPromo.potongan_promo)/100;
            },

            countMultiplier: function(harga){
                let subTotal = parseFloat(harga) * parseFloat(this.datediff);
                return subTotal;
            },

            createImage(file) {
                const reader = new FileReader();
            
                reader.onload = (e) => {
                this.imageUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            },

            onFileChange(file) {
                if (!file) {
                    return;
                }
                this.before
                    this.createImage(file);
            }
        },

        mounted() {
            this.readData();
            this.tampilPromo();
        },
    };
</script>