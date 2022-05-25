<template>
  <v-main class="landing">
      <v-carousel height="700" interval=3000 :show-arrows="false" cycle>
        <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src" gradient="to top, rgba(0,0,0,1), rgba(105,105,105,0.6)">
          <v-row class="fill-height" align="center" justify="center">
              <v-col cols="12" xs="10" sm="10" md="10" lg="10" xl="10">
                  <p class="white--text" style="font-size: 40pt">Atma Jogja Rental</p>
                  <p class="white--text" style="font-size: 20pt">{{item.text}}</p><v-spacer></v-spacer>
                  <v-btn v-if="auth == ''" class="white--text my-5 py-5" style="background-color:#851e3e; font-size: 15pt" href="/register">Pesan Sekarang</v-btn>
                  <v-btn v-else class="white--text my-5 py-5" style="background-color:#851e3e; font-size: 15pt" href="/catalog">Pesan Sekarang</v-btn>
              </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <v-spacer></v-spacer>
      <p class="subTitle mt-6 pt-5" style="font-size:40pt; font-weight: bold">Atma Jogja Rental</p>
      <p class="subTitle mt-5 pt-5 mx-5 px-5" style="font-size:15pt">Atma Jogja Rental adalah pelaku usaha yang bergerak di bidang perjalanan wisata, dan sewa mobil di Yogyakarta. Atma Jogja Rental berdiri pada tanggal 19 April 2022 di Yogyakarta dan berkantor di Jl. Babarsari, Sleman, Yogyakarta. Kami berkomitmen mengutamakan pelayanan terbaik sesuai dengan kebutuhan setiap pelanggan kami, kelengkapan fasilitas operasional dan sumber daya yang terlatih menjadi kepastian pelanggan untuk mendapatkan kenyamanan di setiap aktifitas bersama Atma Jogja Rental.</p>
      <v-spacer></v-spacer>
      <div style="background-color: #dddddd">
      <p class="subTitle mt-6 pt-5" style="font-size:25pt; font-weight: bold">Alasan menggunakan pelayanan kami</p>
      <v-row class="pt-5" style="margin:2rem 0 0 0 !important">
        <v-col>
          <v-row justify="space-around">
          <v-avatar class="myAva" size="100">
            <v-icon dark x-large>
              mdi-timetable
            </v-icon>
          </v-avatar>
          </v-row>
          <v-row justify="space-around">
            <p class="subTitle mt-3" style="font-size:25pt; font-weight: bold">Fleksibel</p>
            <p class="subTitle mt-3 mx-5 px-5" style="font-size:15pt">Pengubahan dan pembatalan pemesanan dapat dilakukan secara gratis</p>
          </v-row>
        </v-col>
        <v-col>
          <v-row justify="space-around">
          <v-avatar class="myAva" size="100">
            <v-icon dark x-large>
              mdi-wallet
            </v-icon>
          </v-avatar>
          </v-row>
          <v-row justify="space-around">
            <p class="subTitle mt-3" style="font-size:25pt; font-weight: bold">Harga Murah</p>
            <p class="subTitle mt-3 mx-5 px-5" style="font-size:15pt">Penawaran harga dijamin lebih murah dibandingkan tempat lain</p>
          </v-row>
        </v-col>
      <v-col>
        <v-row justify="space-around">
          <v-avatar class="myAva" size="100">
            <v-icon dark x-large>
              mdi-account-multiple
            </v-icon>
          </v-avatar>
          </v-row>
          <v-row justify="space-around">
            <p class="subTitle mt-3" style="font-size:25pt; font-weight: bold">Driver Pilihan</p>
            <p class="subTitle mt-3 mx-5 px-5" style="font-size:15pt">Seluruh Driver AJR telah memiliki banyak pengalaman dan jam terbang yang tinggi</p>
          </v-row>
      </v-col>
      </v-row>
      </div>
      <p class="subTitle mt-6 pt-6" justify="space-around" style="font-size:25pt; font-weight: bold">Tertarik untuk sewa mobil?</p>
      <v-btn class="white--text my-2 mb-10" justify="space-around" style="background-color:#851e3e; font-size: 15pt" href="/register">Pesan Sekarang</v-btn>
      <v-footer padless class="mt-5">
        <v-col
          class="text-center white--text"
          cols="12"
          style="background-color:#851e3e"
        >
          {{ new Date().getFullYear() }} — <span>Atma Jogja Rental</span>
        </v-col>
      </v-footer>

      <v-snackbar v-model="snackbar_notify" top outlined color="red" timeout="2000">
          <p class="text-center font-weight-bold">Terdapat {{totalContract}} Mobil Akan Habis Masa Kontrak!</p>
      </v-snackbar>
  </v-main>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Gothic+A1&family=Roboto&display=swap');
  
    .white--text{
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
        color: #ffffff;
    }

    .subTitle{
        font-family: 'Roboto', sans-serif;
        color: #251e3e;
    }

    .myAva{
      background-color: #851e3e;
    }

    @media screen and (min-width:1600px) {
        .landing{
            align-items: center;
            display: flex;
        }

        html {
        overflow: visible;
        }
    }
</style>

<script>
  export default {
    name: "Home",
    data () {
      return {
        items: [
          {
            src: "https://images.unsplash.com/photo-1585503418537-88331351ad99?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
            text: "Sewa Mobil dengan Aman, Nyaman, dan Harga Murah"
          },
          {
            src: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80",
            text: "Dapatkan discount dengan potongan hingga 25%"
          },
          {
            src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            text: "Pilihan mobil yang bervariasi dan driver yang handal"
          }
        ],
        auth:'',
        carscontract: [],
        snackbar_notify: false,
        totalContract: '',
      }
    },
    methods: {
        readContract() {
          var url = this.$api + '/contract';
          this.$http.get(url).then(response => {
            this.carscontract = response.data.data;
            this.totalContract = this.carscontract.length;
            
            if(this.totalContract != 0){
              this.snackbar_notify = true;
            }else{
              this.snackbar_notify = false;
            }
          })
        },
    },
    mounted(){
      if(localStorage.getItem('auth') != null){
        this.auth = localStorage.getItem('auth');
        if(localStorage.getItem('role') == "Admin"){
					this.readContract();
				}
      }else{
        this.auth = '';
      }
    }
  }
</script>