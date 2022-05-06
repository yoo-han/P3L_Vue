<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Daftar Pegawai
                    </h3>
                    <v-row justify="center">
                        <v-col cols="9" class="ps-10">
                            <v-card-title>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table v-model="selected" :headers="headers" :header-props="{ sortIcon: null }" :height="600" :items="pegawais" item-key="id_pegawai"
                                :search="search" :single-select="true" show-select>
                                <template v-slot:[`item.foto_pegawai`]="{ item }">
                                    <div class="p-2">
                                        <v-avatar size="75">
                                        <v-img :src="$baseURL+'storage/'+item.foto_pegawai" max-width="100px"></v-img>
                                        </v-avatar>
                                    </div>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="3" style="padding-top:80px;">
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="green darken-2" @click="addPegawai">
                                    <v-icon x-large color="white"> mdi-plus </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="grey darken-2" @click="updatePegawai(selected)">
                                    <v-icon x-large color="white"> mdi-pencil </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="red darken-2" @click="deletePegawai(selected)">
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
                    <span class="headline">{{ formTitle }} Pegawai</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field label="Nama" v-model="form.nama_pegawai" required></v-text-field>
                        <v-text-field label="E-mail" v-model="form.email_pegawai" required></v-text-field>
                        <v-text-field label="Alamat" v-model="form.alamat_pegawai" required></v-text-field>
                        <v-text-field label="Tanggal Lahir" v-model="form.tanggal_lahir_pegawai" type="date" required></v-text-field>
                        <v-select :items="jenisKelamin" v-model="form.jenis_kelamin_pegawai" label="Jenis Kelamin" item-value="value" item-text="text" append-icon="mdi-gender-male-female" required></v-select>
                        <v-text-field label="Nomor Telepon" v-model="form.no_telp_pegawai" required></v-text-field>
                        <v-file-input @change="onFileChange" v-model="image" prepend-icon="mdi-camera" label="Upload Foto" id="fotoPegawai" ref="fileFotoPegawai" required></v-file-input>
                        <p>Preview Foto</p>
                        <v-img class="mb-5" :src="imageUrl" style="border: 1px dashed #ccc; min-height: 250px"></v-img>
                        <v-select :items="jabatanPegawai" v-model="form.jabatan_pegawai" label="Jabatan" item-value="value" item-text="text" required></v-select>
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
                    <span class="headline">Delete Pegawai</span>
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
                        text: "Nama",
                        sortable: true,
                        value: "nama_pegawai",
                        align:"center",
                    },
                    {
                        text: "Alamat",
                        value: "alamat_pegawai",
                        align:"center",
                    },
                    {
                        text: "Tanggal Lahir",
                        value: "tanggal_lahir_pegawai",
                        align:"center",
                    },
                    {
                        text: "Jenis Kelamin",
                        value: "jenis_kelamin_pegawai",
                        align:"center",
                    },
                    {
                        text: "Email",
                        value: "email_pegawai",
                        align:"center",
                    },
                    {
                        text: "No. Telepon",
                        value: "no_telp_pegawai",
                        align:"center",
                    },
                    {
                        text: "Foto",
                        value: "foto_pegawai",
                        align:"center",
                    },
                    {
                        text: "Jabatan",
                        value: "jabatan_pegawai",
                        align:"center",
                    }
                ],
                pegawai: new FormData,
                pegawais: [],
                singleSelect: true,
                selected: [],
                dialog: false,
                formTitle:'',
                form:{
                    id_pegawai:'',
                    nama_pegawai:'',
                    alamat_pegawai:'',
                    tanggal_lahir_pegawai:'',
                    jenis_kelamin_pegawai:'',
                    email_pegawai:'',
                    password_pegawai:'',
                    no_telp_pegawai:'',
                    foto_pegawai:'',
                    jabatan_pegawai:'',
                },
                dialogDelete: false,
                jabatanPegawai:[
                    {value:'Customer Service', text: 'Customer Service'},
                    {value:'Admin', text: 'Admin'},
                ],
                jenisKelamin:[
                    {value:"Laki-Laki", text:"Laki-Laki"},
                    {value:"Perempuan", text:"Perempuan"},
                ],
                image: [],
                imageUrl:'',
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/pegawai';
                this.$http.get(url).then(response => {
                    this.pegawais = response.data.data;
                })
            },
            addPegawai(){
                this.formTitle = 'Tambah';
                this.dialog = true;
            },

            updatePegawai(selected){
                if(selected[0].jabatan_pegawai != 'Manager'){
                    if(selected.length != 0){
                        this.formTitle = 'Ubah';
                        this.form = {
                            id_pegawai: this.selected[0].id_pegawai,
                            nama_pegawai:this.selected[0].nama_pegawai,
                            alamat_pegawai:this.selected[0].alamat_pegawai,
                            tanggal_lahir_pegawai:this.selected[0].tanggal_lahir_pegawai,
                            jenis_kelamin_pegawai:this.selected[0].jenis_kelamin_pegawai,
                            email_pegawai:this.selected[0].email_pegawai,
                            password_pegawai:this.selected[0].password_pegawai,
                            no_telp_pegawai:this.selected[0].no_telp_pegawai,
                            foto_pegawai:this.selected[0].foto_pegawai,
                            jabatan_pegawai:this.selected[0].jabatan_pegawai,
                        }
                        this.dialog = true;
                        this.imageUrl = this.$baseURL+'storage/'+this.selected[0].foto_pegawai;
                    }else{
                        this.error_message = "Pilih data yang ingin diubah!";
                        this.color = "red";
                        this.snackbar = true;
                        this.load = false;
                    }
                }else{
                    this.error_message = "Data Manager tidak dapat diubah!";
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                }
            },

            save() {
                if(this.formTitle == 'Tambah'){
                    this.pegawai.append('nama_pegawai', this.form.nama_pegawai);
                    this.pegawai.append('alamat_pegawai', this.form.alamat_pegawai);
                    this.pegawai.append('tanggal_lahir_pegawai', this.form.tanggal_lahir_pegawai);
                    this.pegawai.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                    this.pegawai.append('email_pegawai', this.form.email_pegawai);
                    this.pegawai.append('password_pegawai', this.form.password_pegawai);
                    this.pegawai.append('no_telp_pegawai', this.form.no_telp_pegawai);
                    var inputFoto = document.getElementById('fotoPegawai'),
                        dataFotoPegawai = inputFoto.files[0];
                    this.pegawai.append('foto_pegawai', dataFotoPegawai);
                    this.pegawai.append('jabatan_pegawai', this.form.jabatan_pegawai);

                    var url = this.$api + '/pegawai'
                    this.load = true;

                    this.$http.post(url, this.pegawai).then(response => {
                        this.error_message = response.data.message;
                        this.color = "green";
                        this.snackbar = true;
                        this.load = true;
                        this.readData();
                        this.cancel();
                        location.reload();
                        
                    }).catch(error => {
                        this.error_message = error.response.data.message;
                        this.color = "red";
                        this.snackbar = true;
                        this.load = false;
                    });
                }else{
                    var newPegawai = new FormData;
                    newPegawai.append('nama_pegawai', this.form.nama_pegawai);
                    newPegawai.append('alamat_pegawai', this.form.alamat_pegawai);
                    newPegawai.append('tanggal_lahir_pegawai', this.form.tanggal_lahir_pegawai);
                    newPegawai.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                    newPegawai.append('email_pegawai', this.form.email_pegawai);
                    newPegawai.append('password_pegawai', this.form.password_pegawai);
                    newPegawai.append('no_telp_pegawai', this.form.no_telp_pegawai);
                    var inputFoto = document.getElementById('fotoPegawai'),
                        dataFotoPegawai = inputFoto.files[0];
                        if(dataFotoPegawai){
                            newPegawai.append('foto_pegawai', dataFotoPegawai ?? '');
                        }
                    newPegawai.append('jabatan_pegawai', this.form.jabatan_pegawai);
                    console.log(this.selected[0].id_pegawai);
                    var url = this.$api + '/pegawai/' + this.selected[0].id_pegawai;
                    this.load = true;
                    this.$http.post(url, newPegawai).then(response => {
                        this.error_message = response.data.message;
                        this.color = "green";
                        this.snackbar = true;
                        this.load = false;
                        this.readData();
                        this.cancel();
                        location.reload();
                        
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
                    id_pegawai:'',
                    nama_pegawai:'',
                    alamat_pegawai:'',
                    tanggal_lahir_pegawai:'',
                    jenis_kelamin_pegawai:'',
                    email_pegawai:'',
                    password_pegawai:'',
                    no_telp_pegawai:'',
                    foto_pegawai:'',
                    jabatan_pegawai:'',
                };
                this.selected = [];
                this.dialog = false;
            },

            deletePegawai(selected){
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
                var url = this.$api + '/pegawai/' + this.selected[0].id_pegawai;
                this.load = true;
                this.$http.delete(url).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.readData();
                    this.cancelDelete();
                    location.reload();
                    
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
        },
    };
</script>