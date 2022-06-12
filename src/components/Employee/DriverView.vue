<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Daftar Driver
                    </h3>
                    <v-row justify="center">
                        <v-col cols="9" class="ps-10">
                            <v-card-title>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table v-model="selected" :headers="headers" :header-props="{ sortIcon: null }" :height="600" :items="drivers" item-key="id_driver"
                                :search="search" :single-select="true" show-select>
                                <template v-slot:[`item.foto_driver`]="{ item }">
                                    <div class="p-2">
                                        <v-avatar size="75">
                                            <v-img :src="$baseURL+'storage/'+item.foto_driver" max-width="100px">
                                            </v-img>
                                        </v-avatar>
                                    </div>
                                </template>
                                <template v-slot:[`item.sim_driver`]="{ item }">
                                    <div class="p-2">
                                        <v-avatar size="75">
                                            <v-img :src="$baseURL+'storage/'+item.sim_driver" max-width="100px">
                                            </v-img>
                                        </v-avatar>
                                    </div>
                                </template>
                                <template v-slot:[`item.surat_bebas_napza`]="{ item }">
                                    <div class="p-2">
                                        <v-avatar size="75">
                                            <v-img :src="$baseURL+'storage/'+item.surat_bebas_napza" max-width="100px">
                                            </v-img>
                                        </v-avatar>
                                    </div>
                                </template>
                                <template v-slot:[`item.surat_kesehatan_jasmani`]="{ item }">
                                    <div class="p-2">
                                        <v-avatar size="75">
                                            <v-img :src="$baseURL+'storage/'+item.surat_kesehatan_jasmani"
                                                max-width="100px">
                                            </v-img>
                                        </v-avatar>
                                    </div>
                                </template>
                                <template v-slot:[`item.surat_kesehatan_jiwa`]="{ item }">
                                    <div class="p-2">
                                        <v-avatar size="75">
                                            <v-img :src="$baseURL+'storage/'+item.surat_kesehatan_jiwa"
                                                max-width="100px">
                                            </v-img>
                                        </v-avatar>
                                    </div>
                                </template>
                                <template v-slot:[`item.skck`]="{ item }">
                                    <div class="p-2">
                                        <v-avatar size="75">
                                            <v-img :src="$baseURL+'storage/'+item.skck" max-width="100px">
                                            </v-img>
                                        </v-avatar>
                                    </div>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="3" style="padding-top:80px;">
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="green darken-2"
                                    @click="addDriver">
                                    <v-icon x-large color="white"> mdi-plus </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="grey darken-2"
                                    @click="updateDriver(selected)">
                                    <v-icon x-large color="white"> mdi-pencil </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="red darken-2"
                                    @click="deleteDriver(selected)">
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
                    <span class="headline">{{ formTitle }} Driver</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_driver" label="Nama" required></v-text-field>
                        <v-text-field v-model="form.alamat_driver" label="Alamat" required></v-text-field>
                        <v-text-field type="date" v-model="form.tanggal_lahir_driver" label="Tanggal Lahir" required></v-text-field>
                        <v-select :items="jenisKelamin" v-model="form.jenis_kelamin_driver" label="Jenis Kelamin"
                            item-value="value" item-text="text" append-icon="mdi-gender-male-female" required></v-select>
                        <v-text-field type="email" v-model="form.email_driver" label="Email" required></v-text-field>
                        <v-text-field v-model="form.no_telp_driver" label="No. Telepon" required></v-text-field>
                        <v-text-field v-model="form.bahasa" label="Bahasa" required></v-text-field>
                        <v-file-input @change="onFileChangeFoto" prepend-icon="mdi-camera" label="Upload Foto" id="fotoDriver" ref="fileGambarFoto"
                            required></v-file-input>
                        <p>Preview Foto</p>
                        <v-img class="mb-5" :src="imageFotoUrl" style="border: 1px dashed #ccc; min-height: 250px" disabled></v-img>
                        <v-file-input @change="onFileChangeSIM" prepend-icon="mdi-camera" label="Upload SIM" id="fotoSIM" ref="fileGambarSIM"
                            required></v-file-input>
                        <p>Preview SIM</p>
                        <v-img class="mb-5" :src="imageSIMUrl" style="border: 1px dashed #ccc; min-height: 250px" disabled></v-img>
                        <v-file-input @change="onFileChangeSBN" prepend-icon="mdi-camera" label="Upload Surat Bebas Napza" id="fotoSBN"
                            ref="fileGambarSBN" required></v-file-input>
                        <p>Preview Surat Bebas Napza</p>
                        <v-img class="mb-5" :src="imageSBNUrl" style="border: 1px dashed #ccc; min-height: 250px"></v-img>
                        <v-file-input @change="onFileChangeSKJA" prepend-icon="mdi-camera" label="Upload Surat Kesehatan Jasmani" id="fotoSKJA"
                            ref="fileGambarSKJA" required></v-file-input>
                        <p>Preview Surat Kesehatan Jasmani</p>
                        <v-img class="mb-5" :src="imageSKJAUrl" style="border: 1px dashed #ccc; min-height: 250px"></v-img>
                        <v-file-input @change="onFileChangeSKJI" prepend-icon="mdi-camera" label="Upload Surat Kesehatan Jiwa" id="fotoSKJI"
                            ref="fileGambarSKJI" required></v-file-input>
                        <p>Preview Surat Kesehatan Jiwa</p>
                        <v-img class="mb-5" :src="imageSKJIUrl" style="border: 1px dashed #ccc; min-height: 250px"></v-img>
                        <v-file-input @change="onFileChangeSKCK" prepend-icon="mdi-camera" label="Upload SKCK" id="fotoSKCK" ref="fileGambarSKCK"
                            required></v-file-input>
                        <p>Preview SKCK</p>
                        <v-img class="mb-5" :src="imageSKCKUrl" style="border: 1px dashed #ccc; min-height: 250px"></v-img>
                        <v-select v-if="formTitle == 'Ubah'" :items="statusDriver" v-model="form.status_driver"
                            label="Status" item-value="value" item-text="text" required></v-select>
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
                    <span class="headline">Delete Driver</span>
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
                        text: "ID Driver",
                        sortable: true,
                        value: "id_driver",
                        align:"center",
                    },
                    {
                        text: "Nama",
                        value: "nama_driver",
                        align:"center",
                    },
                    {
                        text: "Alamat",
                        value: "alamat_driver",
                        align:"center",
                    },
                    {
                        text: "Tanggal Lahir",
                        value: "tanggal_lahir_driver",
                        align:"center",
                    },
                    {
                        text: "Jenis Kelamin",
                        value: "jenis_kelamin_driver",
                        align:"center",
                    },
                    {
                        text: "Email",
                        value: "email_driver",
                        align:"center",
                    },
                    {
                        text: "No. Telepon",
                        value: "no_telp_driver",
                        align:"center",
                    },
                    {
                        text: "Bahasa",
                        value: "bahasa",
                        align:"center",
                    }, 
                    {
                        text: "Foto Driver",
                        value: "foto_driver",
                        align:"center",
                    },
                    {
                        text: "SIM",
                        value: "sim_driver",
                        align:"center",
                    },
                    {
                        text: "Surat Bebas Napza",
                        value: "surat_bebas_napza",
                        align:"center",
                    },
                    {
                        text: "Surat Kesehatan Jasmani",
                        value: "surat_kesehatan_jasmani",
                        align:"center",
                    },
                    {
                        text: "Surat Kesehatan Jiwa",
                        value: "surat_kesehatan_jiwa",
                        align:"center",
                    },
                    {
                        text: "SKCK",
                        value: "skck",
                        align:"center",
                    },
                    {
                        text: "Status",
                        value: "status_driver",
                        align:"center",
                    },
                    {
                        text: "Rating",
                        value: "rerata_rating",
                        align:"center",
                    },
                    {
                        text: "Jumlah Rating",
                        value: "banyak_rating",
                        align:"center",
                    }
                ],
                driver: new FormData,
                drivers: [],
                singleSelect: true,
                selected: [],
                dialog: false,
                formTitle: '',
                form: {
                    id_driver: '',
                    nama_driver: '',
                    alamat_driver: '',
                    tanggal_lahir_driver: '',
                    jenis_kelamin_driver: '',
                    email_driver: '',
                    password_driver: '',
                    no_telp_driver: '',
                    bahasa: '',
                    foto_driver: '',
                    sim_driver: '',
                    surat_bebas_napza: '',
                    surat_kesehatan_jasmani: '',
                    surat_kesehatan_jiwa: '',
                    skck: '',
                    status_driver: '',
                    rerata_rating: '',
                    banyak_rating: '',
                },
                jenisKelamin: [
                    {
                        value: "Laki-Laki",
                        text: "Laki-Laki"
                    },
                    {
                        value: "Perempuan",
                        text: "Perempuan"
                    },
                ],
                statusDriver: [
                    {
                        value: "Unverified",
                        text: "Unverified"
                    },
                    {
                        value: "Available",
                        text: "Available"
                    },
                    {
                        value: "Not Available",
                        text: "Not Available"
                    },
                ],
                dialogDelete: false,
                imageSIMUrl: '',
                imageSBNUrl:'',
                imageSKJAUrl:'',
                imageSKJIUrl:'',
                imageSKCKUrl:'',
                imageFotoUrl: '',
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/driver';
                this.$http.get(url).then(response => {
                    this.drivers = response.data.data;
                })
            },

            addDriver() {
                this.formTitle = 'Tambah';
                this.dialog = true;
            },

            updateDriver(selected) {
                if (selected.length != 0) {
                    this.formTitle = 'Ubah';
                    this.form = {
                        id_driver: this.selected[0].id_driver,
                        nama_driver: this.selected[0].nama_driver,
                        alamat_driver: this.selected[0].alamat_driver,
                        tanggal_lahir_driver: this.selected[0].tanggal_lahir_driver,
                        jenis_kelamin_driver: this.selected[0].jenis_kelamin_driver,
                        email_driver: this.selected[0].email_driver,
                        password_driver: this.selected[0].password_driver,
                        no_telp_driver: this.selected[0].no_telp_driver,
                        bahasa: this.selected[0].bahasa,
                        foto_driver: this.selected[0].foto_driver,
                        sim_driver: this.selected[0].sim_driver,
                        surat_bebas_napza: this.selected[0].surat_bebas_napza,
                        surat_kesehatan_jasmani: this.selected[0].surat_kesehatan_jasmani,
                        surat_kesehatan_jiwa: this.selected[0].surat_kesehatan_jiwa,
                        skck: this.selected[0].skck,
                        status_driver: this.selected[0].status_driver,
                        rerata_rating: this.selected[0].rerata_rating,
                        banyak_rating: this.selected[0].banyak_rating,
                    }
                    this.dialog = true;
                    this.imageFotoUrl = this.$baseURL+'storage/'+this.selected[0].foto_driver;
                    this.imageSIMUrl = this.$baseURL+'storage/'+this.selected[0].sim_driver;
                    this.imageSBNUrl = this.$baseURL+'storage/'+this.selected[0].surat_bebas_napza;
                    this.imageSKJAUrl = this.$baseURL+'storage/'+this.selected[0].surat_kesehatan_jasmani;
                    this.imageSKJIUrl = this.$baseURL+'storage/'+this.selected[0].surat_kesehatan_jiwa;
                    this.imageSKCKUrl = this.$baseURL+'storage/'+this.selected[0].skck;
                } else {
                    this.error_message = "Pilih data yang ingin diubah!";
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                }
            },

            save() {
                if (this.formTitle == 'Tambah') {
                    this.driver.append('nama_driver', this.form.nama_driver);
                    this.driver.append('alamat_driver', this.form.alamat_driver);
                    this.driver.append('tanggal_lahir_driver', this.form.tanggal_lahir_driver);
                    this.driver.append('jenis_kelamin_driver', this.form.jenis_kelamin_driver);
                    this.driver.append('email_driver', this.form.email_driver);
                    this.driver.append('no_telp_driver', this.form.no_telp_driver);
                    this.driver.append('bahasa', this.form.bahasa);
                    var inputFoto = document.getElementById('fotoDriver'),
                        dataFoto = inputFoto.files[0];
                    this.driver.append('foto_driver', dataFoto);
                    var inputSIM = document.getElementById('fotoSIM'),
                        dataSIM = inputSIM.files[0];
                    this.driver.append('sim_driver', dataSIM);
                    var inputSBN = document.getElementById('fotoSBN'),
                        dataSBN = inputSBN.files[0];
                    this.driver.append('surat_bebas_napza', dataSBN);
                    var inputSKJA = document.getElementById('fotoSKJA'),
                        dataSKJA = inputSKJA.files[0];
                    this.driver.append('surat_kesehatan_jasmani', dataSKJA);
                    var inputSKJI = document.getElementById('fotoSKJI'),
                        dataSKJI = inputSKJI.files[0];
                    this.driver.append('surat_kesehatan_jiwa', dataSKJI);
                    var inputSKCK = document.getElementById('fotoSKCK'),
                        dataSKCK = inputSKCK.files[0];
                    this.driver.append('skck', dataSKCK);

                    var url = this.$api + '/driver'
                    this.load = true;

                    this.$http.post(url, this.driver).then(response => {
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
                } else {
                    var newData = new FormData;
                    newData.append('nama_driver', this.form.nama_driver);
                    newData.append('alamat_driver', this.form.alamat_driver);
                    newData.append('tanggal_lahir_driver', this.form.tanggal_lahir_driver);
                    newData.append('jenis_kelamin_driver', this.form.jenis_kelamin_driver);
                    newData.append('email_driver', this.form.email_driver);
                    newData.append('no_telp_driver', this.form.no_telp_driver);
                    newData.append('bahasa', this.form.bahasa);
                    var inputFoto = document.getElementById('fotoDriver'),
                        dataFoto = inputFoto.files[0];
                    if (dataFoto) {
                        newData.append('foto_driver', dataFoto);
                    }
                    var inputSIM = document.getElementById('fotoSIM'),
                        dataSIM = inputSIM.files[0];
                    if (dataSIM) {
                        newData.append('sim_driver', dataSIM);
                    }
                    var inputSBN = document.getElementById('fotoSBN'),
                        dataSBN = inputSBN.files[0];
                    if (dataSBN) {
                        newData.append('surat_bebas_napza', dataSBN);
                    }
                    var inputSKJA = document.getElementById('fotoSKJA'),
                        dataSKJA = inputSKJA.files[0];
                    if (dataSKJA) {
                        newData.append('surat_kesehatan_jasmani', dataSKJA);
                    }
                    var inputSKJI = document.getElementById('fotoSKJI'),
                        dataSKJI = inputSKJI.files[0];
                    if (dataSKJI) {
                        newData.append('surat_kesehatan_jiwa', dataSKJI);
                    }
                    var inputSKCK = document.getElementById('fotoSKCK'),
                        dataSKCK = inputSKCK.files[0];
                    if (dataSKCK) {
                        newData.append('skck', dataSKCK);
                    }
                    newData.append('status_driver', this.form.status_driver);

                    var url = this.$api + '/driver/' + this.selected[0].id_driver;
                    this.load = true;
                    this.$http.post(url, newData).then(response => {
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

            cancel() {
                this.formTitle = '';
                this.form = {
                    id_driver: '',
                    nama_driver: '',
                    alamat_driver: '',
                    tanggal_lahir_driver: '',
                    jenis_kelamin_driver: '',
                    email_driver: '',
                    password_driver: '',
                    no_telp_driver: '',
                    bahasa: '',
                    foto_driver:'',
                    sim_driver: '',
                    surat_bebas_napza: '',
                    surat_kesehatan_jasmani: '',
                    surat_kesehatan_jiwa: '',
                    skck: '',
                    status_driver: '',
                    rerata_rating: '',
                    banyak_rating: '',
                };
                this.selected = [];
                this.dialog = false;
                this.imageFotoUrl = '';
                this.imageSIMUrl = '';
                this.imageSBNUrl = '';
                this.imageSKJAUrl = '';
                this.imageSKJIUrl = '';
                this.imageSKCKUrl = '';
            },

            deleteDriver(selected) {
                if (selected.length != 0) {
                    this.dialogDelete = true;
                } else {
                    this.error_message = "Pilih data yang ingin diubah!";
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                }
            },

            deleteData() {
                var url = this.$api + '/driver/' + this.selected[0].id_driver;
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

            cancelDelete() {
                this.selected = [];
                this.dialogDelete = false;
            },

            createImageSIM(file) {
                const reader = new FileReader();
            
                reader.onload = (e) => {
                this.imageSIMUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            },

            onFileChangeSIM(file) {
                if (!file) {
                    return;
                }
                this.before
                    this.createImageSIM(file);
            },

            createImageSBN(file) {
                const reader = new FileReader();
            
                reader.onload = (e) => {
                this.imageSBNUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            },

            onFileChangeSBN(file) {
                if (!file) {
                    return;
                }
                this.before
                    this.createImageSBN(file);
            },

            createImageSKJA(file) {
                const reader = new FileReader();
            
                reader.onload = (e) => {
                this.imageSKJAUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            },

            onFileChangeSKJA(file) {
                if (!file) {
                    return;
                }
                this.before
                    this.createImageSKJA(file);
            },

            createImageSKJI(file) {
                const reader = new FileReader();
            
                reader.onload = (e) => {
                this.imageSKJIUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            },

            onFileChangeSKJI(file) {
                if (!file) {
                    return;
                }
                this.before
                    this.createImageSKJI(file);
            },

            createImageSKCK(file) {
                const reader = new FileReader();
            
                reader.onload = (e) => {
                this.imageSKCKUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            },

            onFileChangeSKCK(file) {
                if (!file) {
                    return;
                }
                this.before
                    this.createImageSKCK(file);
            },

            createImageFoto(file) {
                const reader = new FileReader();
            
                reader.onload = (e) => {
                this.imageFotoUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            },

            onFileChangeFoto(file) {
                if (!file) {
                    return;
                }
                this.before
                    this.createImageFoto(file);
            },

        },
        mounted() {
            this.readData();
        },
    };
</script>