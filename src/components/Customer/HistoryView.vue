<template>
    <v-main class="page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <v-card class="pt-10" min-height="100vh">
                    <h3 class="mt-10 my-5 text-center subTitle" style="font-weight:bold; font-size:40pt">Riwayat Peminjaman
                    </h3>
                    <v-row justify="center">
                        <v-col cols="12" class="px-10">
                            <v-card-title>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field>
                            </v-card-title>
                            <v-data-table :headers="headers" :header-props="{ sortIcon: null }" :height="600" :items="transactions"
                                item-key="id_reservasi" :search="search" :single-expand="singleExpand" show-expand @item-expanded="loadDetails">
                                <template v-slot:expanded-item="{ headers, item }">
                                    <td :colspan="headers.length" style="background-color: #FFFAE6; text-align: left; padding: 2% 5%">
                                        <h1 class="subTitle" style="text-align: end">Detail Transaksi</h1>
                                        <p class="subTitle" style="text-align: start; font-size:15pt;">{{ item.id_reservasi }} 
                                            <span class="subTitle" style="float: right; font-size:12pt;">Date: {{ item.tanggal_transaksi }}</span>
                                        </p>
                                        <v-divider></v-divider>
                                        <v-row style="margin: 0;">
                                        <v-col class="text-left subTitle" style="padding-inline: 0">
                                            <table>
                                                <tr style="font-size:12pt">
                                                    <td style="font-weight:bold;">Customer</td>
                                                    <td class="ps-3" style="font-weight:normal;">{{ item.get_customer.nama_customer }}</td>
                                                </tr>
                                                <tr style="font-size:12pt">
                                                    <td style="font-weight:bold;">CS</td>
                                                    <td v-if="item.id_pegawai != null" class="ps-3" style="font-weight:normal;">{{ item.get_pegawai.nama_pegawai }}</td>
                                                    <td v-else class="ps-3" style="font-weight:normal;"> - </td>
                                                </tr>
                                                <tr style="font-size:12pt">
                                                    <td style="font-weight:bold;">Driver</td>
                                                    <td v-if="item.id_driver != null" class="ps-3" style="font-weight:normal;">{{ item.get_driver.nama_driver }}</td>
                                                    <td v-else class="ps-3" style="font-weight:normal;"> - </td>
                                                </tr>
                                            </table>
                                        </v-col>
                                        <v-col class="text-right subTitle" style="padding-inline: 0">
                                            <p style="text-align: end"> Status: 
                                                <span v-if="item.status_reservasi == 'Selesai'" style="color: #28b617;"> {{item.status_reservasi }} </span>
                                                <span v-else-if="item.status_reservasi == 'Sudah Dikonfirmasi'" style="color: #ffad00;"> {{item.status_reservasi }} </span>
                                                <span v-else style="color: #CA300F;"> {{item.status_reservasi }} </span>
                                            </p>
                                            <div v-if="item.status_reservasi == 'Selesai'" >
                                                <v-btn class="subTitle" v-on:click="generateReport"><v-icon>mdi-printer</v-icon>Print Invoice</v-btn>
                                            </div>
                                            <div v-else-if="item.status_reservasi == 'Menunggu Konfirmasi'">
                                                <v-btn class="mx-4 subTitle" v-on:click="rescheduleHandler"><v-icon>mdi-pencil</v-icon>Reschedule</v-btn>
                                                <v-btn class="white--text" v-on:click="dialogCancel = true" color="red darken-3" style="font-weight: bold;"><v-icon>mdi-close</v-icon>Batalkan</v-btn>
                                            </div>
                                            <div v-else-if="item.status_reservasi == 'Belum Bayar Belum Verifikasi' && item.metode_pembayaran == 'Transfer Bank'">
                                                <v-btn class="subTitle" v-on:click="dialogPayment = true"><v-icon>mdi-wallet</v-icon>Bayar</v-btn>
                                            </div>
                                        </v-col>
                                        </v-row>
                                        <v-divider></v-divider>
                                        <v-row class="text-left subTitle" style="margin: 0; padding-inline: 0; padding-top: 12px">
                                            <table>
                                                <tr style="font-size:12pt">
                                                    <td style="font-weight:bold;">Tgl Mulai</td>
                                                    <td class="ps-3" style="font-weight:normal;">{{ item.tanggal_mulai }}</td>
                                                </tr>
                                                <tr style="font-size:12pt">
                                                    <td style="font-weight:bold;">Tgl Selesai</td>
                                                    <td class="ps-3" style="font-weight:normal;">{{ item.tanggal_selesai }}</td>
                                                </tr>
                                                <tr style="font-size:12pt">
                                                    <td style="font-weight:bold;">Tgl Pengembalian</td>
                                                    <td v-if="item.tanggal_kembali != null" class="ps-3" style="font-weight:normal;">{{ item.tanggal_kembali }}</td>
                                                    <td v-else class="ps-3" style="font-weight:normal;"> - </td>
                                                </tr>
                                            </table>
                                        </v-row>
                                        <table class="subTitle responsive-table my-5 mb-5" style="font-size: 12pt;">
                                            <thead class="white--text" style="background-color: #251e3e;">
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Satuan</th>
                                                    <th>Durasi Sewa</th>
                                                    <th>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr style="font-weight: normal;">
                                                    <td data-label="Item">{{item.get_mobil.nama_mobil}}</td>
                                                    <td data-label="Satuan">Rp{{item.get_mobil.harga_sewa}}</td>
                                                    <td data-label="Durasi Sewa">{{datediff}} hari</td>
                                                    <td data-label="Subtotal">Rp{{subtotalMobil}}</td>
                                                </tr>
                                                <tr v-if="item.jenis_reservasi == 'Penyewaan Mobil dan Driver'" style="font-weight: normal;">
                                                    <td v-if="item.id_driver == null" data-label="Item">Driver( ) </td>
                                                    <td v-else data-label="Item">Driver ({{item.get_driver.nama_driver}})</td>
                                                    <td data-label="Satuan">Rp50000</td>
                                                    <td data-label="Durasi Sewa">{{datediff}} hari</td>
                                                    <td data-label="Subtotal">Rp{{subtotalDriver}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div v-if="item.status_reservasi != 'Menunggu Konfirmasi'" class="subTitle" align="left">
                                            <v-divider></v-divider>
                                            <table v-if="item.jenis_reservasi == 'Penyewaan Mobil'" style="font-size:10pt">
                                                <p class="mt-5" style="font-size:12pt; margin-bottom:4px">Rating Driver:</p>
                                                <tr>
                                                    <td style="font-weight:bold;">No. SIM</td>
                                                    <td class="ps-10" style="font-weight:normal;">{{item.no_sim}}</td>
                                                </tr>
                                            </table>
                                            <table v-else style="font-size:10pt">
                                                <p class="mt-5" style="font-size:12pt; margin-bottom:4px">Rating Driver:</p>
                                                <tr>
                                                    <td style="font-weight:bold;">Nama Driver</td>
                                                    <td class="ps-10" style="font-weight:normal;">{{item.get_driver.nama_driver}}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-weight:bold;">Rating Driver</td>
                                                    <td class="ps-10" style="font-weight:normal;">
                                                        <v-rating v-model="item.rating_driver" background-color="yellow darken-3" color="yellow darken-3" dense half-increments readonly small></v-rating>
                                                    </td>
                                                    <td v-if="item.rating_driver == null" style="font-weight:normal;">( 0 )</td>
                                                    <td v-else style="font-weight:normal;">( {{item.rating_driver}} )</td>
                                                </tr>
                                                <tr>
                                                    <td/>
                                                    <td v-if="item.status_reservasi == 'Selesai' && item.rating_driver == null" class="ps-10" style="color: #0730FF; font-weight:normal;"><button @click="dialogRating = true" text style="text-decoration: underline;">Tambah Rating</button></td>
                                                </tr>
                                                <!-- <tr>
                                                    <td style="font-weight:bold;">Tarif Driver</td>
                                                    <td class="ps-10" style="font-weight:normal;">Rp{{ item.tarif_driver }} </td>
                                                </tr> -->
                                            </table>
                                        </div>
                                        <v-divider class="my-5"></v-divider>
                                        <table class="subTitle" align="right" style="font-size:15pt">
                                            <tr>
                                                <td style="font-weight:bold;">Subtotal</td>
                                                <td class="ps-10" style="font-weight:normal;">Rp{{subtotalSeluruh}}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight:bold;">Discount</td>
                                                <td v-if="item.get_promo !== null" class="ps-10" style="font-weight:normal;">- Rp{{potongan}}</td>
                                                <td v-else class="ps-10" style="font-weight:normal;"> - </td>
                                            </tr>
                                            <tr>
                                                <td/>
                                                <td v-if="item.get_promo !== null" class="ps-10" style="font-weight:normal; font-size:12pt;">( {{item.get_promo.kode_promo}} - {{item.get_promo.potongan_promo}}% )</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight:bold;">Denda</td>
                                                <td v-if="item.denda == null" class="ps-10" style="font-weight:normal;"> - </td>
                                                <td v-else class="ps-10" style="font-weight:normal;"> {{item.denda}} </td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight:bold;">Grand Total</td>
                                                <td class="ps-10" style="font-weight:normal;">Rp{{item.total_pembayaran}}</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <div>
                                        <vue-html2pdf
                                            :show-layout="false"
                                            :float-layout="true"
                                            :enable-download="true"
                                            :preview-modal="true"
                                            :paginate-elements-by-height="1400"
                                            filename="hee hee"
                                            :pdf-quality="2"
                                            :manual-pagination="false"
                                            pdf-format="a5"
                                            pdf-orientation="portrait"
                                            pdf-content-width="100%"
                                    
                                            @progress="onProgress($event)"
                                            @hasStartedGeneration="hasStartedGeneration()"
                                            @hasGenerated="hasGenerated($event)"
                                            ref="html2Pdf"
                                        >
                                            <section slot="pdf-content">
                                                <table style="width: 100%;">
                                                    <td style="background-color: #FFFAE6; text-align: left; padding: 10% 5%">
                                                        <h1 class="subTitle" style="text-align: end">Nota Transaksi</h1>
                                                        <p class="subTitle" style="text-align: start; font-size:15pt;">{{ item.id_reservasi }} 
                                                            <span class="subTitle" style="float: right; font-size:12pt;">{{ item.tanggal_transaksi }}</span>
                                                        </p>
                                                        <v-divider style="margin: 25px 0 25px 0"></v-divider>
                                                        <v-row style="margin: 0;">
                                                        <v-col class="text-left subTitle" style="padding-inline: 0">
                                                            <table>
                                                                <tr style="font-size:12pt">
                                                                    <td style="font-weight:bold;">Customer</td>
                                                                    <td class="ps-3" style="padding-left:15px; font-weight:normal;">{{ item.get_customer.nama_customer }}</td>
                                                                </tr>
                                                                <tr style="font-size:12pt">
                                                                    <td style="font-weight:bold;">CS</td>
                                                                    <td v-if="item.id_pegawai != null" class="ps-3" style="padding-left:15px; font-weight:normal;">{{ item.get_pegawai.nama_pegawai }}</td>
                                                                    <td v-else class="ps-3" style="padding-left:15px; font-weight:normal;"> - </td>
                                                                </tr>
                                                                <tr style="font-size:12pt">
                                                                    <td style="font-weight:bold;">Driver</td>
                                                                    <td v-if="item.id_driver != null" class="ps-3" style="padding-left:15px; font-weight:normal;">{{ item.get_driver.nama_driver }}</td>
                                                                    <td v-else class="ps-3" style="padding-left:15px; font-weight:normal;"> - </td>
                                                                </tr>
                                                            </table>
                                                        </v-col>
                                                        <v-col class="text-right subTitle" style="padding-inline: 0">
                                                            <p style="text-align: end"> Status: 
                                                                <span v-if="item.status_reservasi == 'Selesai'" style="color: #28b617;"> {{item.status_reservasi }} </span>
                                                                <span v-else-if="item.status_reservasi == 'Sudah Dikonfirmasi'" style="color: #ffad00;"> {{item.status_reservasi }} </span>
                                                                <span v-else style="color: #CA300F;"> {{item.status_reservasi }} </span>
                                                            </p>
                                                        </v-col>
                                                        </v-row>
                                                        <v-divider style="margin: 25px 0 25px 0"></v-divider>
                                                        <v-row class="text-left subTitle" style="margin: 0; padding-inline: 0; padding: 11px 0 11px 0">
                                                            <table>
                                                                <tr style="font-size:12pt">
                                                                    <td style="font-weight:bold;">Tgl Mulai</td>
                                                                    <td class="ps-3" style="padding-left:15px; font-weight:normal;">{{ item.tanggal_mulai }}</td>
                                                                </tr>
                                                                <tr style="font-size:12pt">
                                                                    <td style="font-weight:bold;">Tgl Selesai</td>
                                                                    <td class="ps-3" style="padding-left:15px; font-weight:normal;">{{ item.tanggal_selesai }}</td>
                                                                </tr>
                                                                <tr style="font-size:12pt">
                                                                    <td style="font-weight:bold;">Tgl Pengembalian</td>
                                                                    <td v-if="item.tanggal_kembali != null" class="ps-3" style="padding-left:15px; font-weight:normal;">{{ item.tanggal_kembali }}</td>
                                                                    <td v-else class="ps-3" style="padding-left:15px; font-weight:normal;"> - </td>
                                                                </tr>
                                                            </table>
                                                        </v-row>
                                                        <table class="subTitle responsive-table my-5 mb-5" style="font-size: 12pt; margin: 30px 0 30px 0">
                                                            <thead class="white--text" style="background-color: #251e3e;  color: #ffffff">
                                                                <tr>
                                                                    <th>Item</th>
                                                                    <th>Satuan</th>
                                                                    <th>Durasi Sewa</th>
                                                                    <th>Subtotal</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr style="font-weight: normal;">
                                                                    <td data-label="Item">{{item.get_mobil.nama_mobil}}</td>
                                                                    <td data-label="Satuan">Rp{{item.get_mobil.harga_sewa}}</td>
                                                                    <td data-label="Durasi Sewa">{{datediff}} hari</td>
                                                                    <td data-label="Subtotal">Rp{{subtotalMobil}}</td>
                                                                </tr>
                                                                <tr v-if="item.jenis_reservasi == 'Penyewaan Mobil dan Driver'" style="font-weight: normal;">
                                                                    <td v-if="item.id_driver == null" data-label="Item">Driver( ) </td>
                                                                    <td v-else data-label="Item">Driver ({{item.get_driver.nama_driver}})</td>
                                                                    <td data-label="Satuan">Rp50000</td>
                                                                    <td data-label="Durasi Sewa">{{datediff}} hari</td>
                                                                    <td data-label="Subtotal">Rp{{subtotalDriver}}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <v-divider class="my-5" style="margin: 25px 0 100px 0"></v-divider>
                                                        <table class="subTitle" align="right" style="font-size:15pt">
                                                            <tr>
                                                                <td style="font-weight:bold;">Subtotal</td>
                                                                <td class="ps-10" style="padding-left:15px; font-weight:normal;">Rp{{subtotalSeluruh}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="font-weight:bold;">Discount</td>
                                                                <td v-if="item.get_promo !== null" class="ps-10" style="padding-left:15px; font-weight:normal;">- Rp{{potongan}}</td>
                                                                <td v-else class="ps-10" style="font-weight:normal;"> - </td>
                                                            </tr>
                                                            <tr>
                                                                <td/>
                                                                <td v-if="item.get_promo !== null" class="ps-10" style="padding-left:15px; font-weight:normal; font-size:12pt;">( {{item.get_promo.kode_promo}} - {{item.get_promo.potongan_promo}}% )</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="font-weight:bold;">Denda</td>
                                                                <td v-if="item.denda == null" class="ps-10" style="padding-left:15px; font-weight:normal;"> - </td>
                                                                <td v-else class="ps-10" style="padding-left:15px; font-weight:normal;"> {{item.denda}} </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="font-weight:bold;">Grand Total</td>
                                                                <td class="ps-10" style="padding-left:15px; font-weight:normal;">Rp{{item.total_pembayaran}}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </table>
                                            </section>
                                        </vue-html2pdf>
                                    </div>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="1" style="background:#251e3e" />
        </v-row>

        <v-dialog v-model="dialogReschedule" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Ubah Reservasi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field type="datetime-local" v-model="form.tanggal_mulai" label="Tanggal Penyewaan Mulai" required @change="startDateChange"></v-text-field>
                        <v-text-field type="datetime-local" v-model="form.tanggal_selesai" label="Tanggal Penyewaan Selesai" required @change="endDateChange"></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="red darken-4" text @click="rescheduleReservasi"> Ubah </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCancel" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Batalkan Reservasi</span>
                </v-card-title>
                <v-card-text>
                    <p>Apakah anda ingin membatalkan ini?</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="red darken-4" text @click="batalReservasi"> Delete </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogPayment" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Bayar Mobil Sewa</span>
                </v-card-title>
                <v-card-text class="my-4">
                    <h2 class="subTitle my-4">Total Pembayaran: {{expanded.total_pembayaran}}</h2>
                    <div class="mt-4">
                        <v-file-input @change="onFileChange" prepend-icon="mdi-camera" label="Upload Bukti Transfer" id="fileBuktiTransfer" ref="fileBuktiTransfer" required></v-file-input>
                        <p>Preview Bukti Transfer</p>
                        <div style="display: flex; justify-content: center;">
                            <v-img class="mb-5" :src="imageUrl" contain max-width="200" max-height="200" style="border: 1px dashed #ccc; align:center"></v-img>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="red darken-4" text @click="paymentUpload"> Upload </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogRating" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Rating Driver</span>
                </v-card-title>
                <v-card-text class="my-4">
                    <v-rating
                        color="warning"
                        hover
                        length="5"
                        size="50"
                        v-model="ratingFromUser"
                    ></v-rating>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="red darken-4" text @click="rateDriver"> Rate </v-btn>
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
</style>

<script>
    import moment from "moment";
    import VueHtml2pdf from 'vue-html2pdf';

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
                        text: "Tanggal Transaksi",
                        value: "tanggal_transaksi",
                        align: "center",
                    },
                    {
                        text: "Nama Mobil",
                        value: "get_mobil.nama_mobil",
                        align: "center",
                    },
                    {
                        text: "Jenis Transaksi",
                        value: "jenis_reservasi",
                        align: "center",
                    },
                    
                    {
                        text: "Status",
                        value: "status_reservasi",
                        align: "center",
                    },
                ],
                form:{
                    tanggal_mulai: null,
                    tanggal_selesai: null,
                },
                transaction: new FormData,
                transactions: [],
                expanded: [],
                singleExpand: true,
                datediff: 0,
                datediffReschedule: 0,
                subtotalMobil: 0,
                subtotalDriver: 0,
                subtotalSeluruh: 0,
                ratingDriver: 0,
                dialogCancel: false,
                dialogReschedule: false,
                dialogPayment: false,
                dialogRating: false,
                start_date: null,
                end_date: null,
                potongan: 0,
                imageUrl: '',
                ratingFromUser: 0,
            };
        },
        methods: {
            readData() {
                var url = this.$api + '/reservasiCustomer/'+localStorage.getItem('id_customer');
                this.$http.get(url).then(response => {
                    this.transactions = response.data.data;
                })
            },

            loadDetails({item}) {
                this.expanded = item;

                let start = moment(this.expanded.tanggal_mulai);
                let end = moment(this.expanded.tanggal_selesai);
                let duration = moment.duration(end.diff(start));
                let hours = duration.asHours();
                if(hours%24 >= 3)
                    this.datediff = Math.round(duration.asDays())+1;
                else
                    this.datediff = Math.round(duration.asDays());

                this.subtotalMobil = this.subTotalMobil(this.expanded.get_mobil.harga_sewa);
                this.subtotalDriver = this.subTotalMobil(50000);
                if(this.expanded.status_reservasi == 'Penyewaan Mobil')
                    this.subtotalSeluruh = this.subtotalMobil;
                else
                    this.subtotalSeluruh = this.subtotalMobil+this.expanded.tarif_driver;
                if(this.expanded.get_promo !== null)
                    this.potongan =  this.subtotalSeluruh * this.expanded.get_promo.potongan_promo / 100;
            },
            
            subTotalMobil: function(hargaMobil){
                let subTotal = parseFloat(hargaMobil) * parseFloat(this.datediff);
                return subTotal;
            },

            batalReservasi(){
                
            console.log(this.expanded)
                var url = this.$api + '/reservasi/' + this.expanded.id_reservasi;
                this.load = true;
                this.$http.delete(url).then(response => {
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

            cancel(){
                this.dialogCancel = false;
                this.dialogReschedule = false;
                this.dialogPayment = false;
                this.dialogRating = false;
                this.start_date = null;
                this.end_date = null;
                this.imageUrl = '';
                this.ratingFromUser = 0;
            },

            generateReport(){
                this.$refs.html2Pdf.generatePdf()
            },

            startDateChange(date){
                this.start_date = moment(date).format('YYYY-MM-DD HH:mm:ss');
                let end = moment(this.end_date);
                let start = moment(this.start_date);
                let duration = moment.duration(end.diff(start));
                let hours = duration.asHours();
                if(hours%24 >= 3)
                    this.datediffReschedule = Math.round(duration.asDays())+1;
                else
                    this.datediffReschedule = Math.round(duration.asDays());
            },

            endDateChange(date){
                this.end_date = moment(date).format('YYYY-MM-DD HH:mm:ss');
                let end = moment(this.end_date);
                let start = moment(this.start_date);
                let duration = moment.duration(end.diff(start));
                let hours = duration.asHours();
                if(hours%24 >= 3)
                    this.datediffReschedule = Math.round(duration.asDays())+1;
                else
                    this.datediffReschedule = Math.round(duration.asDays());
            },

            rescheduleHandler(){
                this.form.tanggal_mulai = this.expanded.tanggal_mulai;
                this.form.tanggal_selesai = this.expanded.tanggal_selesai;
                this.dialogReschedule = true;
            },

            rescheduleReservasi(){
                var subtotalMobil = this.datediffReschedule * this.expanded.get_mobil.harga_sewa;
                if(this.expanded.get_promo !== null){
                    if(this.expanded.jenis_reservasi == 'Penyewaan Mobil')
                        var subtotalDriver = 0;
                    else
                        var subtotalDriver = this.datediffReschedule * 50000;
                    var subtotalSeluruh = (subtotalMobil+subtotalDriver) * (100-this.expanded.get_promo.potongan_promo)/100;
                }
                else {
                    if(this.expanded.jenis_reservasi == 'Penyewaan Mobil')
                        var subtotalDriver = 0;
                    else
                        var subtotalDriver = this.datediffReschedule * 50000;
                    var subtotalSeluruh = (subtotalMobil+subtotalDriver);
                }

                this.transaction.append('tanggal_mulai', this.start_date);
                this.transaction.append('tanggal_selesai', this.end_date);
                if(this.expanded.jenis_reservasi == 'Penyewaan Mobil dan Driver')
                    this.transaction.append('tarif_driver', subtotalDriver);
                this.transaction.append('total_pembayaran', subtotalSeluruh);

                var url = this.$api + '/reservasi/' + this.expanded.id_reservasi;
                this.load = true;
                this.$http.post(url, this.transaction).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.readData();
                    this.cancel();
                    location.reload();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    console.log(this.error_message);
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            paymentUpload(){
                var newData = new FormData;
                var inputFoto = document.getElementById('fileBuktiTransfer'),
                    buktiTransfer = inputFoto.files[0];
                newData.append('bukti_transfer', buktiTransfer);
                newData.append('status_reservasi','Sudah Bayar Belum Verifikasi');

                var url = this.$api + '/reservasi/' + this.expanded.id_reservasi;
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
                    console.log(this.error_message);
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
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
            },

            rateDriver() { 
                var newData = new FormData;
                newData.append('rating_driver', this.ratingFromUser);

                var url = this.$api + '/reservasi/' + this.expanded.id_reservasi;
                this.load = true;
                this.$http.post(url, newData).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.readData();
                    this.cancel();
                    // location.reload();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    console.log(this.error_message);
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            }

        },

        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted() {
            this.readData();
        },

        components: {
            VueHtml2pdf
        }
    };
</script>