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
                            </v-data-table>
                        </v-col>
                        <v-col cols="3" style="padding-top:80px;">
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="green darken-2">
                                    <v-icon x-large color="white"> mdi-plus </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="grey darken-2">
                                    <v-icon x-large color="white"> mdi-pencil </v-icon>
                                </v-btn>
                            </div>
                            <v-spacer />
                            <div style="margin:50px 0px 0px 0px;">
                                <v-btn class="mb-4" style="width:60px; height:60px;" color="red darken-2">
                                    <v-icon x-large color="white"> mdi-delete </v-icon>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="1" style="background:#251e3e" />
        </v-row>
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
                        text: "ID Transaksi",
                        sortable: true,
                        value: "id_reservasi",
                        align: "center",
                    },
                    {
                        text: "ID Customer ",
                        value: "id_customer",
                        align: "center",
                    },
                    {
                        text: "ID Mobil",
                        value: "id_mobil",
                        align: "center",
                    },
                    {
                        text: "ID Pegawai",
                        value: "id_pegawai",
                        align: "center",
                    },
                    {
                        text: "ID Promo",
                        value: "id_promo",
                        align: "center",
                    },
                    {
                        text: "ID Driver",
                        value: "id_driver",
                        align: "center",
                    },
                    {
                        text: "Tanggal Transaksi",
                        value: "tanggal_transaksi",
                        align: "center",
                    },
                    {
                        text: "Tanggal Mulai Peminjaman",
                        value: "tanggal_mulai",
                        align: "center",
                    },
                    {
                        text: "Tanggal Selesai Peminjaman",
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
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/reservasi';
                this.$http.get(url).then(response => {
                    this.transactions = response.data.data;
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
        },
    };
</script>