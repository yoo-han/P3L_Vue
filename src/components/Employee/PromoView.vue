<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Promo</h3>
                    <v-row justify="center">
                        <v-col cols="9" class="ps-10">
                            <v-card-title>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table v-model="selected" :headers="headers" :header-props="{ sortIcon: null }" :height="600" :items="promos" item-key="id_promo"
                                :search="search" :single-select="true" show-select>
                            </v-data-table>
                        </v-col>
                        <v-col cols="3" style="padding-top:80px;">
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="green darken-2" @click="addPromo">
                                    <v-icon x-large color="white"> mdi-plus </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="grey darken-2" @click="updatePromo(selected)">
                                    <v-icon x-large color="white"> mdi-pencil </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="red darken-2" @click="deletePromo(selected)">
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
                    <span class="headline">{{ formTitle }} Promo</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.kode_promo" label="Kode Promo" required></v-text-field>
                        <v-text-field v-model="form.jenis_promo" label="Jenis Promo" required></v-text-field>
                        <v-text-field v-model="form.potongan_promo" label="Potongan" required></v-text-field>
                        <v-textarea v-model="form.keterangan_promo" label="Keterangan" required></v-textarea>
                        <v-select v-if="formTitle == 'Ubah'" :items="status" item-value="value" item-text="text" v-model="form.status_promo" label="Status" required></v-select>
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
                    <span class="headline">Delete Promo</span>
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
                headers: [{
                        text: "Promo",
                        sortable: true,
                        value: "kode_promo",
                        align: "center",
                    },
                    {
                        text: "Jenis",
                        value: "jenis_promo",
                        align: "center",
                    },
                    {
                        text: "Potongan",
                        value: "potongan_promo",
                        align: "center",
                    },
                    {
                        text: "Keterangan",
                        value: "keterangan_promo",
                        align: "center",
                    },
                    {
                        text: "Status",
                        value: "status_promo",
                        align: "center",
                    }
                ],
                promo: new FormData,
                promos: [],
                singleSelect: true,
                selected: [],
                dialog: false,
                formTitle:'',
                form:{
                    id_promo:'',
                    kode_promo:'',
                    jenis_promo:'',
                    potongan_promo:'',
                    keterangan_promo:'',
                    status_promo:'',
                },
                dialogDelete: false,
                status:[
                    {value:"Aktif", text:"Aktif"},
                    {value:"Tidak Aktif", text:"Tidak Aktif"},
                ]
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/promo';
                this.$http.get(url).then(response => {
                    this.promos = response.data.data;
                })
            },

            addPromo(){
                this.formTitle = 'Tambah';
                this.dialog = true;
            },

            updatePromo(selected){
                if(selected.length != 0){
                    this.formTitle = 'Ubah';
                    this.form = {
                        id_promo: this.selected[0].id_promo,
                        kode_promo: this.selected[0].kode_promo,
                        jenis_promo: this.selected[0].jenis_promo,
                        potongan_promo: this.selected[0].potongan_promo,
                        keterangan_promo: this.selected[0].keterangan_promo,
                        status_promo: this.selected[0].status_promo,
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
                    this.promo.append('kode_promo', this.form.kode_promo);
                    this.promo.append('jenis_promo', this.form.jenis_promo);
                    this.promo.append('potongan_promo', this.form.potongan_promo);
                    this.promo.append('keterangan_promo', this.form.keterangan_promo);

                    var url = this.$api + '/promo'
                    this.load = true;

                    this.$http.post(url, this.promo).then(response => {
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
                        kode_promo: this.form.kode_promo,
                        jenis_promo: this.form.jenis_promo,
                        potongan_promo: this.form.potongan_promo,
                        keterangan_promo: this.form.keterangan_promo,
                        status_promo: this.form.status_promo,
                    };
                    var url = this.$api + '/promo/' + this.selected[0].id_promo;
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
                    id_promo:'',
                    kode_promo:'',
                    jenis_promo:'',
                    potongan_promo:'',
                    keterangan_promo:'',
                    status_promo:'',
                };
                this.selected = [];
                this.dialog = false;
            },

            deletePromo(selected){
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
                var url = this.$api + '/promo/' + this.selected[0].id_promo;
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
        },
    };
</script>