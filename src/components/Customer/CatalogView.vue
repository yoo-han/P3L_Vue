<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Daftar Mobil
                    </h3>
                    <v-row justify="center">
                        <v-col cols="12" class="px-10">
                            <v-card-title>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table v-model="selected" :headers="headers" :header-props="{ sortIcon: null }" :height="600" :items="cars" item-key="id_mobil"
                                :search="search" :single-select="true" show-select>
                                <template v-slot:[`item.foto_mobil`]="{ item }">
                                    <div class="p-2">
                                    <v-avatar size="75">
                                        <v-img :src="$baseURL+'storage/'+item.foto_mobil" max-width="100px"></v-img>
                                    </v-avatar>
                                    </div>
                                </template>
                            </v-data-table>
                        </v-col>
                        <!-- <v-col cols="3" style="padding-top:80px;">
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="green darken-2" @click="addCar">
                                    <v-icon x-large color="white"> mdi-plus </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="grey darken-2" @click="updateCar(selected)">
                                    <v-icon x-large color="white"> mdi-pencil </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="red darken-2" @click="deleteCar(selected)">
                                    <v-icon x-large color="white"> mdi-delete </v-icon>
                                </v-btn>
                            </div>
                        </v-col> -->
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="1" style="background:#251e3e" />
        </v-row>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Car</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_mobil" label="Nama Mobil" required></v-text-field>
                        <v-select :items="tipeMobil" v-model="form.tipe_mobil" label="Tipe Mobil" item-value="value" item-text="text" required>
                        </v-select>
                        <v-select :items="jenisTransmisi" v-model="form.jenis_transmisi" label="Jenis Transmisi" item-value="value" item-text="text" required>
                        </v-select>
                        <v-select :items="jenisBahanBakar" v-model="form.jenis_bahan_bakar" label="Jenis Bahan Bakar" item-value="value" item-text="text" required>
                        </v-select>
                        <v-text-field v-model="form.volume_bahan_bakar" label="Volume Bahan Bakar" required></v-text-field>
                        <v-text-field v-model="form.warna_mobil" label="Warna Mobil" required></v-text-field>
                        <v-text-field v-model="form.kapasitas_penumpang" label="Kapasitas Penumpang" required></v-text-field>
                        <v-text-field v-model="form.fasilitas" label="Fasilitas" required></v-text-field>
                        <v-select :items="kategoriAset" v-model="form.kategori_aset" label="Kategori Aset" item-value="value" item-text="text" required>
                        </v-select>
                        <v-select v-if="form.kategori_aset == 'Mitra'" :items="mitraList" v-model="form.id_mitra" item-value="id_mitra" item-text="nama_pemilik" label="Mitra" required clearable return-object></v-select>
                        <v-text-field v-model="form.plat_nomor" label="Plat Nomor" required></v-text-field>
                        <v-text-field v-model="form.nomor_stnk" label="No. STNK" required></v-text-field>
                        <v-text-field v-model="form.harga_sewa" label="Harga Sewa" required></v-text-field>
                        <v-file-input @change="onFileChange" prepend-icon="mdi-camera" label="Upload Foto Mobil" id="fileFotoMobil" ref="fileFotoMobil" required></v-file-input>
                        <p>Preview Foto</p>
                        <v-img class="mb-5" :src="imageUrl" style="border: 1px dashed #ccc; min-height: 250px"></v-img>
                        <v-text-field type="date" v-model="form.tanggal_terakhir_servis" label="Servis Terakhir" clearable required></v-text-field>
                        <v-text-field v-if="formTitle == 'Ubah'" v-model="form.total_peminjaman" label="Total Peminjaman" required></v-text-field>
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
                    <span class="headline">Delete Car</span>
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
                headers: [
                    {
                        text: "Nama",
                        sortable: true,
                        value: "nama_mobil",
                        align:"center",
                    },
                    {
                        text: "Tipe",
                        value: "tipe_mobil",
                        align:"center",
                    },
                    {
                        text: "Transmisi",
                        value: "jenis_transmisi",
                        align:"center",
                    },
                    {
                        text: "Bahan Bakar",
                        value: "jenis_bahan_bakar",
                        align:"center",
                        
                    },
                    {
                        text: "Volume Bahan Bakar",
                        value: "volume_bahan_bakar",
                        align:"center",
                    },
                    {
                        text: "Warna",
                        value: "warna_mobil",
                        align:"center",
                    },
                    {
                        text: "Kapasitas Penumpang",
                        value: "kapasitas_penumpang",
                        align:"center",
                    },
                    {
                        text: "Fasilitas",
                        value: "fasilitas",
                        align:"center",
                    },
                    {
                        text: "Kategori Aset",
                        value: "kategori_aset",
                        align:"center",
                    },
                    {
                        text: "Mitra",
                        value: "get_mitra.nama_pemilik",
                        align:"center",
                    },
                    {
                        text: "Plat Nomor",
                        value: "plat_nomor",
                        align:"center",
                    },
                    {
                        text: "No. STNK",
                        value: "nomor_stnk",
                        align:"center",
                    },
                    {
                        text: "Harga",
                        value: "harga_sewa",
                        align:"center",
                    },
                    {
                        text: "Foto",
                        value: "foto_mobil",
                        align:"center",
                    },
                    {
                        text: "Total Peminjaman",
                        value: "total_peminjaman",
                        align:"center",
                    },
                    {
                        text: "Servis Terakhir",
                        value: "tanggal_terakhir_servis",
                        align:"center",
                    },
                    {
                        text: "Status",
                        value: "status_mobil",
                        align:"center",
                    },
                ],
                car: new FormData,
                cars: [],
                singleSelect: true,
                selected: [],
                dialog: false,
                formTitle:'',
                form:{
                    id_mobil: '',
                    id_mitra: '',
                    nama_mobil: '',
                    tipe_mobil: '',
                    jenis_transmisi: '',
                    jenis_bahan_bakar: '',
                    volume_bahan_bakar: '',
                    warna_mobil: '',
                    kapasitas_penumpang: '',
                    fasilitas: '',
                    kategori_aset: '',
                    plat_nomor: '',
                    nomor_stnk: '',
                    harga_sewa: '',
                    foto_mobil: '',
                    total_peminjaman: '',
                    tanggal_terakhir_servis: '',
                },
                dialogDelete: false,
                mitraList: [],
                tipeMobil: [
                    {value: "Sedan", text: "Sedan"},
                    {value: "City Car", text: "City Car"},
                    {value: "SUV", text: "SUV"},
                    {value: "MPV", text: "MPV"},
                ],
                jenisTransmisi: [
                    {value: "AT", text: "AT"},
                    {value: "MT", text: "MT"},
                    {value: "CVT", text: "CVT"},
                ],
                jenisBahanBakar: [
                    {value: "Pertamax", text: "Pertamax"},
                    {value: "Pertalite", text: "Pertalite"},
                    {value: "Solar", text: "Solar"},
                ],
                kategoriAset: [
                    {value: "Mitra", text: "Mitra"},
                    {value: "Perusahaan", text: "Perusahaan"},
                ],
                image: [],
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

            addCar(){
                this.formTitle = 'Tambah';
                this.dialog = true;
            },

            updateCar(selected){
                if(selected.length != 0){
                    this.formTitle = 'Ubah';
                    this.form = {
                        id_mobil: this.selected[0].id_mobil,
                        id_mitra: this.selected[0].id_mitra,
                        nama_mobil: this.selected[0].nama_mobil,
                        tipe_mobil: this.selected[0].tipe_mobil,
                        jenis_transmisi: this.selected[0].jenis_transmisi,
                        jenis_bahan_bakar: this.selected[0].jenis_bahan_bakar,
                        volume_bahan_bakar: this.selected[0].volume_bahan_bakar,
                        warna_mobil: this.selected[0].warna_mobil,
                        kapasitas_penumpang: this.selected[0].kapasitas_penumpang,
                        fasilitas: this.selected[0].fasilitas,
                        kategori_aset: this.selected[0].kategori_aset,
                        plat_nomor: this.selected[0].plat_nomor,
                        nomor_stnk: this.selected[0].nomor_stnk,
                        harga_sewa: this.selected[0].harga_sewa,
                        foto_mobil: this.selected[0].foto_mobil,
                        total_peminjaman: this.selected[0].total_peminjaman,
                        tanggal_terakhir_servis: this.selected[0].tanggal_terakhir_servis,
                    },
                    this.dialog = true;
                    this.imageUrl = this.$baseURL+'storage/'+this.selected[0].foto_mobil;
                }else{
                    this.error_message = "Pilih data yang ingin diubah!";
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                }
            },

            save() {
                if(this.formTitle == 'Tambah'){
                    this.car.append('id_mitra', this.form.id_mitra);
                    this.car.append('nama_mobil', this.form.nama_mobil);
                    this.car.append('tipe_mobil', this.form.tipe_mobil);
                    this.car.append('jenis_transmisi', this.form.jenis_transmisi);
                    this.car.append('jenis_bahan_bakar', this.form.jenis_bahan_bakar);
                    this.car.append('volume_bahan_bakar', this.form.volume_bahan_bakar);
                    this.car.append('warna_mobil', this.form.warna_mobil);
                    this.car.append('kapasitas_penumpang', this.form.kapasitas_penumpang);
                    this.car.append('fasilitas', this.form.fasilitas);
                    this.car.append('kategori_aset', this.form.kategori_aset);
                    this.car.append('plat_nomor', this.form.plat_nomor);
                    this.car.append('nomor_stnk', this.form.nomor_stnk);
                    this.car.append('harga_sewa', this.form.harga_sewa);
                    var inputFoto = document.getElementById('fileFotoMobil'),
                        dataFotoMobil = inputFoto.files[0];
                    this.car.append('foto_mobil', dataFotoMobil);
                    this.car.append('tanggal_terakhir_servis', this.form.tanggal_terakhir_servis);

                    var url = this.$api + '/mobil'
                    this.load = true;

                    this.$http.post(url, this.car).then(response => {
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
                    var newCar = new FormData;
                    newCar.append('id_mitra', this.form.id_mitra ?? '');
                    newCar.append('nama_mobil', this.form.nama_mobil);
                    newCar.append('tipe_mobil', this.form.tipe_mobil);
                    newCar.append('jenis_transmisi', this.form.jenis_transmisi);
                    newCar.append('jenis_bahan_bakar', this.form.jenis_bahan_bakar);
                    newCar.append('volume_bahan_bakar', this.form.volume_bahan_bakar);
                    newCar.append('warna_mobil', this.form.warna_mobil);
                    newCar.append('kapasitas_penumpang', this.form.kapasitas_penumpang);
                    newCar.append('fasilitas', this.form.fasilitas);
                    newCar.append('kategori_aset', this.form.kategori_aset);
                    newCar.append('plat_nomor', this.form.plat_nomor);
                    newCar.append('nomor_stnk', this.form.nomor_stnk);
                    newCar.append('harga_sewa', this.form.harga_sewa);
                    var inputFoto = document.getElementById('fileFotoMobil'),
                        dataFotoMobil = inputFoto.files[0];
                        if(dataFotoMobil){
                            newCar.append('foto_mobil', dataFotoMobil);
                        }
                    newCar.append('tanggal_terakhir_servis', this.form.tanggal_terakhir_servis ?? '');
                    newCar.append('total_peminjaman', this.form.total_peminjaman);

                    var url = this.$api + '/mobil/' + this.selected[0].id_mobil;
                    this.load = true;
                    this.$http.post(url, newCar).then(response => {
                        this.error_message = response.data.message;
                        this.color = "green";
                        this.snackbar = true;
                        this.load = false;
                        this.readData();
                        this.cancel();
                        
                    }).catch(error => {
                        this.error_message = error.response.data.message;
                        console.log(this.error_message);
                        this.color = "red";
                        this.snackbar = true;
                        this.load = false;
                    });
                }
                
            },

            cancel(){
                this.formTitle = '';
                this.form = {
                    id_mobil: '',
                    id_mitra: '',
                    nama_mobil: '',
                    tipe_mobil: '',
                    jenis_transmisi: '',
                    jenis_bahan_bakar: '',
                    volume_bahan_bakar: '',
                    warna_mobil: '',
                    kapasitas_penumpang: '',
                    fasilitas: '',
                    kategori_aset: '',
                    plat_nomor: '',
                    nomor_stnk: '',
                    harga_sewa: '',
                    foto_mobil: '',
                    total_peminjaman: '',
                    tanggal_terakhir_servis: '',
                };
                this.selected = [];
                this.dialog = false;
                this.imageUrl = '';
            },

            deleteCar(selected){
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
                var url = this.$api + '/mobil/' + this.selected[0].id_mobil;
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

            getMitraList() {
                var url = this.$api + '/mitra';
                this.$http.get(url).then(response => {
                    this.mitraList = response.data.data;
                })
                .catch(error => {
                    console.log(error)
                })
    
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
            this.getMitraList();
        },
    };
</script>