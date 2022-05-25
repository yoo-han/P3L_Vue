<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Daftar Mitra
                    </h3>
                    <v-row justify="center">
                        <v-col cols="9" class="ps-10">
                            <v-card-title>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table v-model="selected" :headers="headers" :header-props="{ sortIcon: null }" :height="600" :items="mitras" item-key="id_mitra"
                                :search="search" :single-select="true" show-select>
                                <!-- <template v-slot:[`item.alert_kontrak`]="{ item }">
                                    <label v-if="item.alert_kontrak != 'dekatKontrak'">
                                    <v-icon color="green darken-4" @click="snackbar_kontrakAman=true">mdi-check-circle</v-icon>
                                    </label>
                                    <template v-for="items in mitrascontract">
                                        <label :key="items" v-if="item.id_mitra == items.id_mitra" style="height: 40px;">
                                        <v-icon color="red darken-4" @click="snackbar_kontrakHabis=true">mdi-alert</v-icon>
                                        </label>
                                    </template>
                                </template> -->
                            </v-data-table>
                        </v-col>
                        <v-col cols="3" style="padding-top:80px;">
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="green darken-2" @click="addMitra">
                                    <v-icon x-large color="white"> mdi-plus </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="grey darken-2"  @click="updateMitra(selected)">
                                    <v-icon x-large color="white"> mdi-pencil </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="red darken-2" @click="deleteMitra(selected)">
                                    <v-icon x-large color="white"> mdi-delete </v-icon>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="1" style="background:#251e3e" />
        </v-row>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Mitra</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_pemilik" label="Nama Pemilik" required></v-text-field>
                        <v-text-field v-model="form.no_ktp_pemilik" label="No. KTP" required></v-text-field>
                        <v-text-field v-model="form.alamat_pemilik" label="Alamat" required></v-text-field>
                        <v-text-field v-model="form.no_telp_pemilik" label="No. Telepon" required></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.periode_kontrak_mulai" label="Periode Mulai Kontrak" required></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.periode_kontrak_akhir" label="Periode Akhir Kontrak" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-4" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Delete Mitra</span>
                </v-card-title>
                <v-card-text>
                    <p>Apakah data ini ingin dihapus?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelDelete"> Cancel </v-btn>
                    <v-btn color="red darken-4" text @click="deleteData"> Delete </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom> {{ error_message }}</v-snackbar>
    
        <!-- <v-snackbar v-model="snackbar_kontrakHabis" color="red" timeout="2000">
            <p class="text-center font-weight-bold">Periode kontrak akan habis</p>
        </v-snackbar>

        <v-snackbar v-model="snackbar_kontrakAman" color="green" timeout="2000">
            <p class="text-center font-weight-bold">Periode kontrak masih lama</p>
        </v-snackbar> -->

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
    export default {
        name: "List",
        data() {
            return {
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                headers: [
                    // {
                    //     text: "Masa Kontrak",
                    //     value: "alert_kontrak",
                    //     align: "center",
                    // },
                    {
                        text: "Mitra",
                        value: "nama_pemilik",
                        align: "center",
                    },
                    {
                        text: "No. KTP",
                        value: "no_ktp_pemilik",
                        align: "center",
                    },
                    {
                        text: "Alamat",
                        value: "alamat_pemilik",
                        align: "center",
                    },
                    {
                        text: "No. Telepon",
                        value: "no_telp_pemilik",
                        align: "center",
                    },
                    {
                        text: "Mulai Kontrak",
                        value: "periode_kontrak_mulai",
                        align: "center",
                    },
                    {
                        text: "Akhir Kontrak",
                        value: "periode_kontrak_akhir",
                        align: "center",
                    }
                ],
                mitra: new FormData,
                mitras: [],
                mitrascontract: [],
                singleSelect: true,
                selected: [],
                dialog: false,
                formTitle:'',
                form:{
                    id_mitra:'',
                    nama_pemilik:'',
                    no_ktp_pemilik:'',
                    alamat_pemilik:'',
                    no_telp_pemilik:'',
                    periode_kontrak_mulai:'',
                    periode_kontrak_akhir:'',
                },
                dialogDelete: false,
                snackbar_kontrakHabis: false,
                snackbar_kontrakAman: false,
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/mitra';
                this.$http.get(url).then(response => {
                    this.mitras = response.data.data;
                })
                
            },

            readContract() {
                var url = this.$api + '/contract';
                this.$http.get(url).then(response => {
                    this.mitrascontract = response.data.data;
                    
                    for(var i=0; i < this.mitrascontract.length; i++)
                    {
                        for(var j=0; j < this.mitras.length; j++)
                        {
                            if(this.mitrascontract[i].id_mitra == this.mitras[j].id_mitra)
                            {
                                this.mitras[j].alert_kontrak = "dekatKontrak";
                            }
                        }
                    }
                })
            },

            addMitra(){
                this.formTitle = 'Tambah';
                this.dialog = true;
            },

            updateMitra(selected){
                if(selected.length != 0){
                    this.formTitle = 'Ubah';
                    this.form = {
                        id_mitra: this.selected[0].id_mitra,
                        nama_pemilik: this.selected[0].nama_pemilik,
                        no_ktp_pemilik: this.selected[0].no_ktp_pemilik,
                        alamat_pemilik: this.selected[0].alamat_pemilik,
                        no_telp_pemilik: this.selected[0].no_telp_pemilik,
                        periode_kontrak_mulai: this.selected[0].periode_kontrak_mulai,
                        periode_kontrak_akhir: this.selected[0].periode_kontrak_akhir,
                    }
                    this.dialog = true;
                }else{
                    this.error_message = "Pilih data yang ingin diubah!";
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                }
            },

            save() {
                if(this.formTitle == 'Tambah'){
                    this.mitra.append('nama_pemilik', this.form.nama_pemilik);
                    this.mitra.append('no_ktp_pemilik', this.form.no_ktp_pemilik);
                    this.mitra.append('alamat_pemilik', this.form.alamat_pemilik);
                    this.mitra.append('no_telp_pemilik', this.form.no_telp_pemilik);
                    this.mitra.append('periode_kontrak_mulai', this.form.periode_kontrak_mulai);
                    this.mitra.append('periode_kontrak_akhir', this.form.periode_kontrak_akhir);

                    var url = this.$api + '/mitra'
                    this.load = true;

                    this.$http.post(url, this.mitra).then(response => {
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
                }else{
                    let newData = {
                        nama_pemilik : this.form.nama_pemilik,
                        no_ktp_pemilik : this.form.no_ktp_pemilik,
                        alamat_pemilik : this.form.alamat_pemilik,
                        no_telp_pemilik: this.form.no_telp_pemilik,
                        periode_kontrak_mulai: this.form.periode_kontrak_mulai,
                        periode_kontrak_akhir: this.form.periode_kontrak_akhir
                    };
                    var url = this.$api + '/mitra/' + this.selected[0].id_mitra;
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

            cancel(){
                this.formTitle = '';
                this.form = {
                    id_mitra:'',
                    nama_pemilik:'',
                    no_ktp_pemilik:'',
                    alamat_pemilik:'',
                    no_telp_pemilik:'',
                    periode_kontrak_mulai:'',
                    periode_kontrak_akhir:'',
                };
                this.selected = [];
                this.dialog = false;
            },

            deleteMitra(selected){
                if(selected.length != 0){   
                    this.dialogDelete = true;
                }else{
                    this.error_message = "Pilih data yang ingin diubah!";
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                }
            },

            deleteData(){
                var url = this.$api + '/mitra/' + this.selected[0].id_mitra;
                this.load = true;
                this.$http.delete(url).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.readData();
                    this.cancelDelete();
                    
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            cancelDelete(){
                this.selected = [];
                this.dialogDelete = false;
            }

        },
        mounted() {
            this.readData();
            this.readContract();
        },
    };
</script>