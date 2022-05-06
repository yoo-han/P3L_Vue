<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Daftar Customer
                    </h3>
                    <v-row justify="center">
                        <v-col cols="9" class="ps-10">
                            <v-card-title>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table v-model="selected" :headers="headers" :header-props="{ sortIcon: null }" :height="600" :items="customers"
                                item-key="id_customer" :search="search" :single-select="true" show-select>
                                <template v-slot:[`item.ktp_customer`]="{ item }">
                                    <div class="p-2">
                                        <v-avatar size="75">
                                            <v-img :src="$baseURL+'storage/'+item.ktp_customer" max-width="100px">
                                            </v-img>
                                        </v-avatar>
                                    </div>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="3" style="padding-top:80px;">
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="grey darken-2"
                                    @click="updateCustomer(selected)">
                                    <v-icon x-large color="white"> mdi-pencil </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="red darken-2"
                                    @click="deleteCustomer(selected)">
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
                    <span class="headline">{{ formTitle }} Customer</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field label="Nama" v-model="form.nama_customer" required disabled></v-text-field>
                        <v-text-field label="E-mail" v-model="form.email_customer" required disabled></v-text-field>
                        <v-text-field label="Alamat" v-model="form.alamat_customer" required disabled></v-text-field>
                        <v-text-field label="Tanggal Lahir" v-model="form.tanggal_lahir_customer" type="date" required
                            disabled></v-text-field>
                        <v-select :items="jenisKelamin" v-model="form.jenis_kelamin_customer" label="Jenis Kelamin"
                            item-value="value" item-text="text" append-icon="mdi-gender-male-female" required disabled>
                        </v-select>
                        <v-text-field label="Nomor Telepon" v-model="form.no_telp_customer" required disabled>
                        </v-text-field>
                        <v-file-input @change="onFileChange" v-model="image" prepend-icon="mdi-camera" label="Upload KTP" id="fileKTP" ref="fileGambarKTP"
                            required disabled></v-file-input>
                        <p>Preview KTP</p>
                        <v-img class="mb-5" :src="imageUrl" style="border: 1px dashed #ccc; min-height: 250px"></v-img>
                        <v-select v-if="formTitle == 'Ubah'" :items="statusCustomer" v-model="form.status_customer"
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
                    <span class="headline">Delete Customer</span>
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
                        text: "ID Customer",
                        value: "id_customer",
                        sortable: true,
                        align:"center",
                    },
                    {
                        text: "Nama",
                        value: "nama_customer",
                        align:"center",
                    },
                    {
                        text: "Alamat",
                        value: "alamat_customer",
                        align:"center",
                    },
                    {
                        text: "Tanggal Lahir",
                        value: "tanggal_lahir_customer",
                        align:"center",
                    },
                    {
                        text: "Jenis Kelamin",
                        value: "jenis_kelamin_customer",
                        align:"center",
                    },
                    {
                        text: "Email",
                        value: "email_customer",
                        align:"center",
                    },
                    {
                        text: "No. Telepon",
                        value: "no_telp_customer",
                        sortable: false,
                        align:"center",
                    },
                    {
                        text: "KTP",
                        value: "ktp_customer",
                        align:"center",
                    },
                    {
                        text: "Status",
                        value: "status_customer",
                        align:"center",
                    }
                ],
                customer: new FormData,
                customers: [],
                singleSelect: true,
                selected: [],
                dialog: false,
                formTitle: '',
                form: {
                    id_customer: '',
                    nama_customer: '',
                    alamat_customer: '',
                    tanggal_lahir_customer: '',
                    jenis_kelamin_customer: '',
                    email_customer: '',
                    password_customer: '',
                    no_telp_customer: '',
                    ktp_customer: '',
                    status_customer: '',
                },
                dialogDelete: false,
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
                statusCustomer: [
                    {
                        value: "Unverified",
                        text: "Unverified"
                    },
                    {
                        value: "Verified",
                        text: "Verified"
                    },
                ],
                image: [],
                imageUrl:'',
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/customer';
                this.$http.get(url).then(response => {
                    this.customers = response.data.data;
                })
            },

            updateCustomer(selected) {
                if (selected.length != 0) {
                    this.formTitle = 'Ubah';
                    this.form = {
                        id_customer: this.selected[0].id_customer,
                        nama_customer: this.selected[0].nama_customer,
                        alamat_customer: this.selected[0].alamat_customer,
                        tanggal_lahir_customer: this.selected[0].tanggal_lahir_customer,
                        jenis_kelamin_customer: this.selected[0].jenis_kelamin_customer,
                        email_customer: this.selected[0].email_customer,
                        password_customer: this.selected[0].password_customer,
                        no_telp_customer: this.selected[0].no_telp_customer,
                        ktp_customer: this.selected[0].ktp_customer,
                        status_customer: this.selected[0].status_customer,
                    }
                    this.dialog = true;
                    this.imageUrl = this.$baseURL+'storage/'+this.selected[0].ktp_customer;
                } else {
                    this.error_message = "Pilih data yang ingin diubah!";
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                }
            },

            save() {
                this.customer.append('nama_customer', this.form.nama_customer);
                this.customer.append('email_customer', this.form.email_customer);
                this.customer.append('alamat_customer', this.form.alamat_customer);
                this.customer.append('tanggal_lahir_customer', this.form.tanggal_lahir_customer);
                this.customer.append('jenis_kelamin_customer', this.form.jenis_kelamin_customer);
                this.customer.append('no_telp_customer', this.form.no_telp_customer);
                // var inputKTP = document.getElementById('fileKTP'),
                //     dataFileKTP = inputKTP.files[0];
                // newCustomer.append('ktp_customer', dataFileKTP);
                this.customer.append('status_customer', this.form.status_customer);

                var url = this.$api + '/customer/' + this.selected[0].id_customer;
                this.load = true;
                this.$http.post(url, this.customer).then(response => {
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
            },

            cancel() {
                this.formTitle = '';
                this.form = {
                    id_customer: '',
                    nama_customer: '',
                    alamat_customer: '',
                    tanggal_lahir_customer: '',
                    jenis_kelamin_customer: '',
                    email_customer: '',
                    password_customer: '',
                    no_telp_customer: '',
                    ktp_customer: '',
                    status_customer: '',
                };
                this.selected = [];
                this.dialog = false;
                this.imageUrl = '';
            },

            deleteCustomer(selected) {
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
                var url = this.$api + '/customer/' + this.selected[0].id_customer;
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