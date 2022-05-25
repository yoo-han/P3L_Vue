<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Jadwal Pegawai
                    </h3>
                    <v-row justify="center">
                        <v-col cols="9" class="ps-10">
                            <v-card-title>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table v-model="selected" :headers="headers" :header-props="{ sortIcon: null }" :height="600" :items="schedules"
                                item-key="id_detail_shift" :search="search" :single-select="true" show-select>
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
                        <v-select v-if="formTitle == 'Tambah'" :items="pegawaiList" v-model="form.id_pegawai" item-value="id_pegawai" :item-text="item => item.nama_pegawai +' - '+ item.jabatan_pegawai" label="Pegawai" required></v-select>
                        <v-select v-else :items="pegawaiList" v-model="form.id_pegawai" item-value="id_pegawai" :item-text="item => item.nama_pegawai +' - '+ item.jabatan_pegawai" label="Pegawai" required disabled></v-select>
                        <v-select :items="shiftList" v-model="form.id_shift" item-value="id_shift" :item-text="item => item.nama_shift +' ('+ item.jam_kerja_mulai +' - '+ item.jam_kerja_selesai +')'" label="Shift" required></v-select>
                        <v-select :items="hariList" v-model="form.hari" item-value="value" item-text="text" label="Hari" required></v-select>
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
                        text: "Pegawai",
                        sortable: true,
                        value: "get_pegawai.nama_pegawai",
                        align:"center",
                    },
                    {
                        text: "Jabatan",
                        sortable: true,
                        value: "get_pegawai.jabatan_pegawai",
                        align:"center",
                    },
                    {
                        text: "Hari",
                        value: "hari",
                        align:"center",
                    },
                    {
                        text: "Shift",
                        sortable: true,
                        value: "get_shift.nama_shift",
                        align:"center",
                    },
                    {
                        text: "Jam Mulai",
                        value: "get_shift.jam_kerja_mulai",
                        align:"center",
                    },
                    {
                        text: "Jam Selesai",
                        value: "get_shift.jam_kerja_selesai",
                        align:"center",
                    },
                ],
                schedule: new FormData,
                schedules: [],
                singleSelect: true,
                selected: [],
                dialog: false,
                formTitle:'',
                form:{
                    id_detail_shift:'',
                    id_pegawai:'',
                    id_shift:'',
                    hari:'',
                },
                dialogDelete: false,
                pegawaiList: [],
                shiftList: [],
                hariList: [
                    {
                        value: "Senin",
                        text: "Senin"
                    },
                    {
                        value: "Selasa",
                        text: "Selasa"
                    },
                    {
                        value: "Rabu",
                        text: "Rabu"
                    },
                    {
                        value: "Kamis",
                        text: "Kamis"
                    },
                    {
                        value: "Jumat",
                        text: "Jumat"
                    },
                    {
                        value: "Sabtu",
                        text: "Sabtu"
                    },
                    {
                        value: "Minggu",
                        text: "Minggu"
                    },
                ],
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/jadwal';
                this.$http.get(url).then(response => {
                    this.schedules = response.data.data;
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
                        id_detail_shift : this.selected[0].id_detail_shift,
                        id_pegawai : this.selected[0].id_pegawai,
                        id_shift : this.selected[0].id_shift,
                        hari : this.selected[0].hari,
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
                    this.schedule.append('id_pegawai', this.form.id_pegawai);
                    this.schedule.append('id_shift', this.form.id_shift);
                    this.schedule.append('hari', this.form.hari);

                    var url = this.$api + '/jadwal'
                    this.load = true;

                    this.$http.post(url, this.schedule).then(response => {
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
                        id_pegawai : this.form.id_pegawai,
                        id_shift : this.form.id_shift,
                        hari : this.form.hari,
                    };
                    var url = this.$api + '/jadwal/' + this.selected[0].id_detail_shift;
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
                    id_detail_shift:'',
                    id_pegawai:'',
                    id_shift:'',
                    hari:'',
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
                var url = this.$api + '/jadwal/' + this.selected[0].id_detail_shift;
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
            },

            getShiftList() {
                var url = this.$api + '/shift';
                this.$http.get(url).then(response => {
                    this.shiftList = response.data.data;
                })
                .catch(error => {
                    console.log(error)
                })
    
            },

            getPegawaiList() {
                var url = this.$api + '/showWithoutManager';
                this.$http.get(url).then(response => {
                    this.pegawaiList = response.data.data;
                })
                .catch(error => {
                    console.log(error)
                })
    
            },
        },
        computed: {
            formTitle() {
                return this.inputType;
            },
        },
        mounted() {
            this.readData();
            this.getPegawaiList();
            this.getShiftList();
        },
    };
</script>