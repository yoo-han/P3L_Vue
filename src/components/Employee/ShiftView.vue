<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Shift Pegawai
                    </h3>
                    <v-row justify="center">
                        <v-col cols="9" class="ps-10">
                            <v-card-title>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table v-model="selected" :headers="headers" :header-props="{ sortIcon: null }" :height="600" :items="shifts" item-key="id_shift"
                                :search="search" :single-select="true" show-select>
                            </v-data-table>
                        </v-col>
                        <v-col cols="3" style="padding-top:80px;">
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="green darken-2" @click="addShift">
                                    <v-icon x-large color="white"> mdi-plus </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="grey darken-2" @click="updateShift(selected)">
                                    <v-icon x-large color="white"> mdi-pencil </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="red darken-2" @click="deleteShift(selected)">
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
                    <span class="headline">{{ formTitle }} Shift</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_shift" label="Shift" required></v-text-field>
                        <v-text-field type="time" v-model="form.jam_kerja_mulai" label="Jam Mulai" required></v-text-field>
                        <v-text-field type="time" v-model="form.jam_kerja_selesai" label="Jam Selesai" required></v-text-field>
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
                    <span class="headline">Delete Shift</span>
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
                        text: "Shift",
                        sortable: true,
                        value: "nama_shift",
                        align: "center",
                    },
                    {
                        text: "Jam Mulai",
                        value: "jam_kerja_mulai",
                        align: "center",
                    },
                    {
                        text: "Jam Selesai",
                        value: "jam_kerja_selesai",
                        align: "center",
                    }
                ],
                shift: new FormData,
                shifts: [],
                singleSelect: true,
                selected: [],
                dialog: false,
                formTitle:'',
                form:{
                    id_shift:'',
                    nama_shift:'',
                    jam_kerja_mulai:'',
                    jam_kerja_selesai:'',
                },
                dialogDelete: false,
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/shift';
                this.$http.get(url).then(response => {
                    this.shifts = response.data.data;
                })
            },

            addShift(){
                this.formTitle = 'Tambah';
                this.dialog = true;
            },

            updateShift(selected){
                if(selected.length != 0){
                    this.formTitle = 'Ubah';
                    this.form = {
                        id_shift: this.selected[0].id_shift,
                        nama_shift: this.selected[0].nama_shift,
                        jam_kerja_mulai: this.selected[0].jam_kerja_mulai,
                        jam_kerja_selesai: this.selected[0].jam_kerja_selesai,
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
                    this.shift.append('nama_shift', this.form.nama_shift);
                    this.shift.append('jam_kerja_mulai', this.form.jam_kerja_mulai);
                    this.shift.append('jam_kerja_selesai', this.form.jam_kerja_selesai);

                    var url = this.$api + '/shift'
                    this.load = true;

                    this.$http.post(url, this.shift).then(response => {
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
                        nama_shift : this.form.nama_shift,
                        jam_kerja_mulai : this.form.jam_kerja_mulai,
                        jam_kerja_selesai : this.form.jam_kerja_selesai,
                    };
                    var url = this.$api + '/shift/' + this.selected[0].id_shift;
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
                    id_shift:'',
                    nama_shift:'',
                    jam_kerja_mulai:'',
                    jam_kerja_selesai:'',
                };
                this.selected = [];
                this.dialog = false;
            },

            deleteShift(selected){
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
                var url = this.$api + '/shift/' + this.selected[0].id_shift;
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