/* eslint-disable */
/**
 * 도시별 호텔 상위 5개. 'Hotel Top List - May 2026.xlsx' 에서 자동 추출.
 * 운세 결과의 추천 도시에 자동 매칭됩니다.
 */

export interface Hotel {
  /** Top 순위 (해당 국가 내) */
  rank: number;
  /** Hotel Code (OTA 시스템 키) */
  code: string;
  name: string;
  /** 영문 도시명 (xlsx 그대로) */
  city: string;
  address: string;
  /** "jp" | "kr" | "vn" */
  country: "jp" | "kr" | "vn";
}

export const HOTELS_BY_CITY: Record<string, Hotel[]> = {
  "Osaka": [
    {
      "country": "jp",
      "rank": 1,
      "code": "995715",
      "name": "The OneFive Osaka Namba Dotonbori",
      "city": "Osaka",
      "address": "2-13, Soemoncho, Chuo-ku, Osaka"
    },
    {
      "country": "jp",
      "rank": 6,
      "code": "1001675",
      "name": "The OneFive Osaka Shinsekai",
      "city": "Osaka",
      "address": "2-1-24, Ebisu-higashi, Naniwa-ku, Osaka, 556-0002"
    },
    {
      "country": "jp",
      "rank": 7,
      "code": "763368",
      "name": "Smile Hotel Osaka Yotsubashi",
      "city": "Osaka",
      "address": "1-chome-4-12 Shinmachi Nishi Ward"
    },
    {
      "country": "jp",
      "rank": 9,
      "code": "285030",
      "name": "Smile Hotel Premium Osaka Higashi Shinsaibashi",
      "city": "Osaka",
      "address": "2-13-17 Shimanouchi Chuo-ku"
    },
    {
      "country": "jp",
      "rank": 11,
      "code": "206762",
      "name": "Red Roof Inn & Suites Osaka - Namba/Nippombashi",
      "city": "Osaka",
      "address": "2-7-9 Nipponbashi, Chuo-ku"
    }
  ],
  "Tokyo": [
    {
      "country": "jp",
      "rank": 2,
      "code": "581662",
      "name": "ICI HOTEL Tokyo Hatchobori",
      "city": "Tokyo",
      "address": "3-26-11 Hachobori, Chuo-ku"
    },
    {
      "country": "jp",
      "rank": 3,
      "code": "327376",
      "name": "Sotetsu Grand Fresa Tokyo - Bay Ariake",
      "city": "Tokyo",
      "address": "3-6-6 Ariake, Koto-ku"
    },
    {
      "country": "jp",
      "rank": 5,
      "code": "752333",
      "name": "SOTETSU GRAND FRESA TAKADANOBABA",
      "city": "Tokyo",
      "address": "1-chome-27-7 Takadanobaba"
    },
    {
      "country": "jp",
      "rank": 8,
      "code": "204439",
      "name": "Sotetsu Fresa Inn Tokyo Roppongi",
      "city": "Tokyo",
      "address": "3-10-1 Roppongi, Minato-ku"
    },
    {
      "country": "jp",
      "rank": 10,
      "code": "566162",
      "name": "Smile Hotel Sugamo",
      "city": "Tokyo",
      "address": "2-4-7 Sugamo Toshima-ku"
    }
  ],
  "Kyoto": [
    {
      "country": "jp",
      "rank": 4,
      "code": "108838",
      "name": "Vessel Hotel Campana Kyoto Gojo",
      "city": "Kyoto",
      "address": "498 Shimomanjuji-cho, Gojo Sagaru Higashinotoin-dori, Shimogyo-ku"
    },
    {
      "country": "jp",
      "rank": 36,
      "code": "732266",
      "name": "Sotetsu Fresa Inn Kyoto-Kiyomizu Gojo",
      "city": "Kyoto",
      "address": "391 Shiogamacho Shimogyo Ward"
    },
    {
      "country": "jp",
      "rank": 37,
      "code": "859473",
      "name": "Miyako City Kintetsu Kyoto Station",
      "city": "Kyoto",
      "address": "1-9, Kamadono-cho, Higashi Shiokoji Shimogyo-ku"
    },
    {
      "country": "jp",
      "rank": 43,
      "code": "279046",
      "name": "The OneFive Kyoto Shijo",
      "city": "Kyoto",
      "address": "535 Karatsuya-cho Shijo Horikawa Nishiiru, Shimogyo-ku"
    },
    {
      "country": "jp",
      "rank": 53,
      "code": "682771",
      "name": "Agora Kyoto Karasuma",
      "city": "Kyoto",
      "address": "701-1 Myodenji-cho Shimogyo-ku"
    }
  ],
  "Fukuoka": [
    {
      "country": "jp",
      "rank": 17,
      "code": "552124",
      "name": "Hotel Monterey Fukuoka",
      "city": "Fukuoka",
      "address": "3-4-13 Watanabedori, Chuo-ku, fukuoka"
    },
    {
      "country": "jp",
      "rank": 25,
      "code": "279206",
      "name": "Washington R&B Hotel Hakataekimae Dai 2",
      "city": "Fukuoka",
      "address": "4-3-20 Hakata Ekimae"
    },
    {
      "country": "jp",
      "rank": 32,
      "code": "163030",
      "name": "Hotel Monte Hermana Fukuoka",
      "city": "Fukuoka",
      "address": "3-4-24 Watanabedori, Chuo-ku"
    },
    {
      "country": "jp",
      "rank": 34,
      "code": "560918",
      "name": "Hakata Nakasu Washington Hotel Plaza",
      "city": "Fukuoka",
      "address": "2-8-28 Nakasu, Hakata-ku"
    },
    {
      "country": "jp",
      "rank": 42,
      "code": "399985",
      "name": "Oriental Hotel Fukuoka Hakata Station",
      "city": "Fukuoka",
      "address": "4-23 Hakataekichuogai"
    }
  ],
  "Kobe": [
    {
      "country": "jp",
      "rank": 23,
      "code": "581258",
      "name": "Hotel Monterey KOBE",
      "city": "Kobe",
      "address": "2-11-13 Shimoyamatedori"
    },
    {
      "country": "jp",
      "rank": 29,
      "code": "409119",
      "name": "Sotetsu Fresa Inn Kobe Sannomiya",
      "city": "Kobe",
      "address": "5-2-3, Asahidori, Chuo-ku"
    },
    {
      "country": "jp",
      "rank": 59,
      "code": "822540",
      "name": "Kobe Meriken Park Oriental Hotel",
      "city": "Kobe",
      "address": "5-6 Hatobacho Chuo-ku"
    },
    {
      "country": "jp",
      "rank": 65,
      "code": "158060",
      "name": "Hotel Monte Hermana Kobe Amalie",
      "city": "Kobe",
      "address": "2-2-28 Nakayamate-dori Chuo-ku"
    },
    {
      "country": "jp",
      "rank": 87,
      "code": "768541",
      "name": "KOKO HOTEL Kobe Sannomiya",
      "city": "Kobe",
      "address": "63 Naniwamachi Chuo Ward"
    }
  ],
  "Naha": [
    {
      "country": "jp",
      "rank": 27,
      "code": "746964",
      "name": "hotel androoms Naha Port",
      "city": "Naha",
      "address": "2-23-1 Nishi"
    },
    {
      "country": "jp",
      "rank": 31,
      "code": "629843",
      "name": "Hotel Palm Royal Naha Kokusai Street",
      "city": "Naha",
      "address": "3-9-10 Makishi"
    },
    {
      "country": "jp",
      "rank": 70,
      "code": "182883",
      "name": "Living Inn Asahibashi Ekimae Premier",
      "city": "Naha",
      "address": "11-17 Higashimachi, Naha-shi, Okinawa, Japan"
    },
    {
      "country": "jp",
      "rank": 95,
      "code": "500813",
      "name": "Hotel Lantana Naha matsuyama",
      "city": "Naha",
      "address": "1-13-20 Matsuyama"
    }
  ],
  "Chatan": [
    {
      "country": "jp",
      "rank": 33,
      "code": "607761",
      "name": "Vessel Hotel Campana Okinawa",
      "city": "Chatan",
      "address": "9-22 Mihama, Chatan Cho Nakagami-gun"
    },
    {
      "country": "jp",
      "rank": 96,
      "code": "570012",
      "name": "Lequ Okinawa Chatan Spa & Resort",
      "city": "Chatan",
      "address": "34-2 Mihama"
    }
  ],
  "Sapporo": [
    {
      "country": "jp",
      "rank": 45,
      "code": "748760",
      "name": "Sapporo Washington Hotel Plaza",
      "city": "Sapporo",
      "address": "1-chome-3-9 Kita 6 Jonishi Kita Ward"
    },
    {
      "country": "jp",
      "rank": 57,
      "code": "584450",
      "name": "Keio Plaza Hotel Sapporo",
      "city": "Sapporo",
      "address": "2-1 North 5 West 7,Chuou-ku"
    },
    {
      "country": "jp",
      "rank": 62,
      "code": "982751",
      "name": "the b sapporo",
      "city": "Sapporo",
      "address": "17-17, Minami 3-jo Nishi 2-chome, Chuo-ku, Sapporo, Hokkaido 060-0063, Japan"
    },
    {
      "country": "jp",
      "rank": 82,
      "code": "235485",
      "name": "Smile Hotel PREMIUM SAPPOROSUSUKINO",
      "city": "Sapporo",
      "address": "1-13-1, Minami4-jonishi"
    },
    {
      "country": "jp",
      "rank": 94,
      "code": "417502",
      "name": "Vessel Hotel Campana Susukino",
      "city": "Sapporo",
      "address": "6-16-1 Minami 5 Jonishi"
    }
  ],
  "Nagoya": [
    {
      "country": "jp",
      "rank": 46,
      "code": "712350",
      "name": "Sotetsu Fresa Inn Nagoya-Shinkansenguchi",
      "city": "Nagoya",
      "address": "19-16 Tsubakicho Nakamura"
    },
    {
      "country": "jp",
      "rank": 67,
      "code": "435294",
      "name": "Nagoya Sakae Washington Hotel Plaza",
      "city": "Nagoya",
      "address": "3-1-32 Sakae Naka-ku"
    },
    {
      "country": "jp",
      "rank": 85,
      "code": "294898",
      "name": "Vessel Hotel Campana Nagoya",
      "city": "Nagoya",
      "address": "2-30-7, Meieki, Nakamura-ku"
    }
  ],
  "Gangneung": [
    {
      "country": "kr",
      "rank": 1,
      "code": "241059",
      "name": "Skybay Hotel Gyeongpo",
      "city": "Gangneung",
      "address": "476 Haean-ro"
    },
    {
      "country": "kr",
      "rank": 65,
      "code": "905282",
      "name": "PINEART LABEL",
      "city": "Gangneung",
      "address": "32, Haean-ro, Gangneung-si, Gangwon-do, South Korea"
    },
    {
      "country": "kr",
      "rank": 85,
      "code": "630132",
      "name": "SL Hotel Gangneung",
      "city": "Gangneung",
      "address": "59, Jumun-ro, Jumunjin-eup"
    }
  ],
  "Seoul": [
    {
      "country": "kr",
      "rank": 2,
      "code": "741474",
      "name": "Roynet Hotel Seoul Mapo",
      "city": "Seoul",
      "address": "67, Mapo-daero, Mapo-gu"
    },
    {
      "country": "kr",
      "rank": 3,
      "code": "886479",
      "name": "The Stay Classic Myeongdong",
      "city": "Seoul",
      "address": "27, Namdaemun-ro, Jung-gu, Seoul, Republic of Korea"
    },
    {
      "country": "kr",
      "rank": 4,
      "code": "857930",
      "name": "Hotel Bernoui Seoul",
      "city": "Seoul",
      "address": "229, Gyeongin-ro, Guro-gu, Seoul."
    },
    {
      "country": "kr",
      "rank": 5,
      "code": "794192",
      "name": "Baiton Hotel Seoul Dongdaemun",
      "city": "Seoul",
      "address": "346, Dongho-ro, Jung-gu"
    },
    {
      "country": "kr",
      "rank": 6,
      "code": "738638",
      "name": "Golden Seoul Hotel",
      "city": "Seoul",
      "address": "663, Gonghang-daero, Gangseo-gu"
    }
  ],
  "Busan": [
    {
      "country": "kr",
      "rank": 8,
      "code": "809241",
      "name": "Busan Connect Ocean Hotel",
      "city": "Busan",
      "address": "115-1 Daegyo-ro"
    },
    {
      "country": "kr",
      "rank": 12,
      "code": "401573",
      "name": "Hotel Society",
      "city": "Busan",
      "address": "37, Gunam-ro, 12beon-gil, Haeundae-gu"
    },
    {
      "country": "kr",
      "rank": 18,
      "code": "344354",
      "name": "Hotel Nongshim",
      "city": "Busan",
      "address": "23, Geumganggongwon-ro 20beon-gil Dongnae-gu"
    },
    {
      "country": "kr",
      "rank": 25,
      "code": "807588",
      "name": "Hotel TT Gupo",
      "city": "Busan",
      "address": "1684, Nakdong-daero, Buk-gu"
    },
    {
      "country": "kr",
      "rank": 32,
      "code": "442536",
      "name": "H Avenue Gwangalli Beach",
      "city": "Busan",
      "address": "42, Gwanganhaebyeon-ro 278beon-gil Suyeong-gu"
    }
  ],
  "Seogwipo": [
    {
      "country": "kr",
      "rank": 11,
      "code": "886465",
      "name": "Youus Hotel",
      "city": "Seogwipo",
      "address": "21, Cheonjeyeon-ro 178beon-gil, Seogwipo-si, Jeju-do, Republic of Korea"
    },
    {
      "country": "kr",
      "rank": 16,
      "code": "748544",
      "name": "Jeju Pureun Hotel",
      "city": "Seogwipo",
      "address": "47, Seohojung-ro"
    },
    {
      "country": "kr",
      "rank": 42,
      "code": "746325",
      "name": "Sanbangsan Hotel",
      "city": "Seogwipo",
      "address": "2093, Iljuseo-ro, Daejeong-eup"
    },
    {
      "country": "kr",
      "rank": 50,
      "code": "1001048",
      "name": "Seongsan Marina Hotel",
      "city": "Seogwipo",
      "address": "94, Goseong-ojo-ro, Seongsan-eup, Seogwipo-si, Jeju Special Self-Governing Province, 63639, South Korea"
    },
    {
      "country": "kr",
      "rank": 54,
      "code": "710138",
      "name": "Kenny Stay Jeju Mosulpo (Hotel Kenny)",
      "city": "Seogwipo",
      "address": "22, Hamojungang-ro, Daejeong-eup"
    }
  ],
  "Jeju City": [
    {
      "country": "kr",
      "rank": 14,
      "code": "301540",
      "name": "Dyneoceano Hotel",
      "city": "Jeju City",
      "address": "394, Aewolhaean-ro Aewol-eup"
    },
    {
      "country": "kr",
      "rank": 15,
      "code": "213522",
      "name": "Gloucester Hotel Jeju",
      "city": "Jeju City",
      "address": "57, Sammu-ro"
    },
    {
      "country": "kr",
      "rank": 21,
      "code": "397853",
      "name": "Best Western Jeju Hotel",
      "city": "Jeju City",
      "address": "27, Doryeong-ro"
    },
    {
      "country": "kr",
      "rank": 26,
      "code": "857046",
      "name": "Manhattan Hotel",
      "city": "Jeju City",
      "address": "66, Doryeong-ro"
    },
    {
      "country": "kr",
      "rank": 31,
      "code": "886463",
      "name": "Ebenezer Hotel",
      "city": "Jeju City",
      "address": "504, Johamhaean-ro, Jocheon-eup, Jeju-si, Jeju-do, Republic of Korea"
    }
  ],
  "Yeosu": [
    {
      "country": "kr",
      "rank": 30,
      "code": "670609",
      "name": "Ramada Plaza by Wyndham Dolsan Yeosu",
      "city": "Yeosu",
      "address": "11 Gangnamhaean-ro Dolsan-eup"
    },
    {
      "country": "kr",
      "rank": 34,
      "code": "379991",
      "name": "La Terrace Boutique Resort & Spa",
      "city": "Yeosu",
      "address": "29-12, Jinmo 1-gil, Dolsan-eup"
    },
    {
      "country": "kr",
      "rank": 45,
      "code": "360900",
      "name": "OceanHill Hotel",
      "city": "Yeosu",
      "address": "81, Gangnamhaean-ro, Dolsan-eup"
    },
    {
      "country": "kr",
      "rank": 61,
      "code": "886597",
      "name": "Calacatta Hotel & Resort",
      "city": "Yeosu",
      "address": "1405-50 Pyeongsa-ri, Dolsan-eup Yeosu-si, Jeollanamdo, South Korea, 556905"
    },
    {
      "country": "kr",
      "rank": 79,
      "code": "132380",
      "name": "Matthieu Yeosu",
      "city": "Yeosu",
      "address": "20, Odongdo-ro, Yeosu-si, Jeollanam-do"
    }
  ],
  "Sokcho": [
    {
      "country": "kr",
      "rank": 43,
      "code": "155227",
      "name": "Hyundai Soo Resort Sokcho",
      "city": "Sokcho",
      "address": "153, Imok-ro"
    },
    {
      "country": "kr",
      "rank": 51,
      "code": "293937",
      "name": "Shinsegae Youngrangho Resort",
      "city": "Sokcho",
      "address": "170 Yeongnanghoban-gil"
    },
    {
      "country": "kr",
      "rank": 52,
      "code": "692763",
      "name": "Sokcho Chonpines Beach Hotel",
      "city": "Sokcho",
      "address": "B - 1F, 171, Haeoreum-ro"
    },
    {
      "country": "kr",
      "rank": 64,
      "code": "755136",
      "name": "Chungchoho Best Hotel",
      "city": "Sokcho",
      "address": "28, Cheongchohoban-ro"
    },
    {
      "country": "kr",
      "rank": 89,
      "code": "1001364",
      "name": "Sokcho Mari Vista Hotel",
      "city": "Sokcho",
      "address": "4027 Donghae-daero, Sokcho-si, Gangwon-do, South Korea"
    }
  ],
  "Yangyang": [
    {
      "country": "kr",
      "rank": 53,
      "code": "211449",
      "name": "Naksan Beach Hotel",
      "city": "Yangyang",
      "address": "73, Naksansa-ro Ganghyeon-myeon"
    },
    {
      "country": "kr",
      "rank": 63,
      "code": "710258",
      "name": "CENTUMMARK Hotel Yangyang",
      "city": "Yangyang",
      "address": "9 Hangogae-gil, Yangyang-eup, Yangyang-gun, Gangwon-do"
    },
    {
      "country": "kr",
      "rank": 81,
      "code": "1001627",
      "name": "Dignity Hotel Yangyang",
      "city": "Yangyang",
      "address": "159-5 Ilchul-ro, Yangyang-eup, Yangyang-gun, Gangwon-do"
    }
  ],
  "Gyeongju": [
    {
      "country": "kr",
      "rank": 97,
      "code": "605837",
      "name": "Lahan Select Gyeongju",
      "city": "Gyeongju",
      "address": "338, Bomun-ro"
    }
  ],
  "Nha Trang": [
    {
      "country": "vn",
      "rank": 1,
      "code": "886622",
      "name": "Seaesta Hotel Nha Trang",
      "city": "Nha Trang",
      "address": "116A Hong Bang street, Tan Lap Ward, Nha Trang city, Vietnam"
    },
    {
      "country": "vn",
      "rank": 3,
      "code": "215829",
      "name": "Maple Hotel & Apartment",
      "city": "Nha Trang",
      "address": "16 Ton Dan, Loc Tho Ward"
    },
    {
      "country": "vn",
      "rank": 7,
      "code": "389454",
      "name": "Muong Thanh Luxury Khanh Hoa Hotel",
      "city": "Nha Trang",
      "address": "Khu 01, khu dan cu Con Tan Lap Xuong Huan Ward"
    },
    {
      "country": "vn",
      "rank": 8,
      "code": "1001369",
      "name": "Seaside Boutique Hotel Nha Trang Beach",
      "city": "Nha Trang",
      "address": "70 Dong Da, Tan Lap Ward, Tan Lap, Nha Trang, Khanh Hoa, Vietnam"
    },
    {
      "country": "vn",
      "rank": 14,
      "code": "396766",
      "name": "Le More Hotel",
      "city": "Nha Trang",
      "address": "33A To Hien Thanh street Tan Lap ward"
    }
  ],
  "Da Nang": [
    {
      "country": "vn",
      "rank": 2,
      "code": "139868",
      "name": "Terra Boutique Hotel",
      "city": "Da Nang",
      "address": "05 Phan Liem, Ngu Hanh Son"
    },
    {
      "country": "vn",
      "rank": 5,
      "code": "805287",
      "name": "Minh Toan Galaxy Hotel",
      "city": "Da Nang",
      "address": "306, 2/9 St., Hai Chau Dist"
    },
    {
      "country": "vn",
      "rank": 18,
      "code": "861138",
      "name": "Ocean Haven Hotel Danang",
      "city": "Da Nang",
      "address": "295-297 Ho Nghinh St., Phuoc My Ward, Son Tra District, Da Nang City"
    },
    {
      "country": "vn",
      "rank": 20,
      "code": "192950",
      "name": "Alani Sea View Hotel (Former Alani Hotel & Spa Da Nang)",
      "city": "Da Nang",
      "address": "134-136-138 Tran Bach Dang My An Ward, Ngu Hanh Son District"
    },
    {
      "country": "vn",
      "rank": 24,
      "code": "886627",
      "name": "Mercy Emerald Hotel",
      "city": "Da Nang",
      "address": "Number 170 – 172 – 174 Nguyen Van Thoai, My An Ward, Ngu Hanh Son District, Da Nang City, Vietnam"
    }
  ],
  "Phu Quoc": [
    {
      "country": "vn",
      "rank": 4,
      "code": "985239",
      "name": "Grand Ocean Bay Resort Phu Quoc",
      "city": "Phu Quoc",
      "address": "Ong Lang Hamlet, Cua Duong Commune, Phu Quoc, Kien Giang, Vietnam"
    },
    {
      "country": "vn",
      "rank": 6,
      "code": "251392",
      "name": "Camia Resort & Spa",
      "city": "Phu Quoc",
      "address": "Lot 3, Ong Lang Hamlet, Cua Duong Ward"
    },
    {
      "country": "vn",
      "rank": 29,
      "code": "709121",
      "name": "Ocean Bay Phu Quoc Resort & Spa",
      "city": "Phu Quoc",
      "address": "Duong vao Dinh Ba, Ong Lang, Cua Duong"
    },
    {
      "country": "vn",
      "rank": 52,
      "code": "705669",
      "name": "Night Sea Hotel",
      "city": "Phu Quoc",
      "address": "124 Tran Hung Dao"
    }
  ],
  "Ho Chi Minh City": [
    {
      "country": "vn",
      "rank": 9,
      "code": "606114",
      "name": "Rex Hotel Saigon",
      "city": "Ho Chi Minh City",
      "address": "141 Nguyen Hue Blvd"
    },
    {
      "country": "vn",
      "rank": 15,
      "code": "1001076",
      "name": "Signature by M Village Hai Ba Trung",
      "city": "Ho Chi Minh City",
      "address": "74 Hai Ba Trung, Ben Nghe Ward, District 1, Ho Chi Minh City, Vietnam"
    },
    {
      "country": "vn",
      "rank": 39,
      "code": "721746",
      "name": "Caravelle Hotel",
      "city": "Ho Chi Minh City",
      "address": "19 - 23 Lam Son Square, District 1"
    },
    {
      "country": "vn",
      "rank": 59,
      "code": "1001392",
      "name": "M Village Hotel Nguyen Du",
      "city": "Ho Chi Minh City",
      "address": "149 Nguyen Du, Ben Thanh Ward, District 1, Ho Chi Minh City"
    },
    {
      "country": "vn",
      "rank": 60,
      "code": "982790",
      "name": "Signature by M Village Le Thanh Ton",
      "city": "Ho Chi Minh City",
      "address": "24 Le Thanh ton Street, Ben Nghe Ward, District 01, Ho Chi Minh, Vietnam"
    }
  ],
  "Hoi An": [
    {
      "country": "vn",
      "rank": 10,
      "code": "831975",
      "name": "Moodhoian Riverside Resort & Spa",
      "city": "Hoi An",
      "address": "To 1, thon Vong Nhi, Xa Cam Thanh"
    },
    {
      "country": "vn",
      "rank": 23,
      "code": "999166",
      "name": "Reu Boutique Hotel",
      "city": "Hoi An",
      "address": "128/9 Ly Thai To Str"
    },
    {
      "country": "vn",
      "rank": 28,
      "code": "776717",
      "name": "Bellerive Hoi An Hotel and Spa",
      "city": "Hoi An",
      "address": "33 Le Dai Hanh Street Cua Dai Ward"
    },
    {
      "country": "vn",
      "rank": 45,
      "code": "1001659",
      "name": "Grand Signature by M Village Hoi An Resort",
      "city": "Hoi An",
      "address": "27-28 Nguyen Tat Thanh, Cam Ha, Hoi An City"
    },
    {
      "country": "vn",
      "rank": 53,
      "code": "995733",
      "name": "Sen Village Hoi An",
      "city": "Hoi An",
      "address": "488 Cua Dai, Cam Chau, Hoi An, Quang Nam, Vietnam"
    }
  ],
  "Phan Thiet": [
    {
      "country": "vn",
      "rank": 12,
      "code": "1001415",
      "name": "Amana Hotel Phan Thiet",
      "city": "Phan Thiet",
      "address": "Lo D3-4-6-8 Duong so 5 Ocean Dunes, Phu Thuy, Phan Thiet, Binh Thuan Province"
    },
    {
      "country": "vn",
      "rank": 16,
      "code": "179835",
      "name": "Pandanus Resort",
      "city": "Phan Thiet",
      "address": "3 Nguyen Huu Tho, Mui Ne"
    },
    {
      "country": "vn",
      "rank": 17,
      "code": "501961",
      "name": "TTC Hotel - Phan Thiet",
      "city": "Phan Thiet",
      "address": "Doi Duong, Le Loi Hung Long"
    },
    {
      "country": "vn",
      "rank": 73,
      "code": "850884",
      "name": "Muong Thanh Mui Ne Hotel",
      "city": "Phan Thiet",
      "address": "54 Huynh Thuc Khang, Ham Tien"
    }
  ],
  "Hanoi": [
    {
      "country": "vn",
      "rank": 22,
      "code": "1001510",
      "name": "M Village Hotel Kim Ma",
      "city": "Hanoi",
      "address": "132-138 Kim Ma, Ba Dinh Ward, Kim Ma ward, Ba Dinh District, Hanoi, Vietnam"
    },
    {
      "country": "vn",
      "rank": 42,
      "code": "1001282",
      "name": "M Village Hotel Tho Nhuom",
      "city": "Hanoi",
      "address": "54 Tho Nhuom, Tran Hung Dao Ward, Hoan Kiem District, Ha Noi"
    },
    {
      "country": "vn",
      "rank": 51,
      "code": "848249",
      "name": "22Land Lake View Hotel",
      "city": "Hanoi",
      "address": "65 Trich Sai, Thuy Khue, Tay Ho, Hanoi"
    },
    {
      "country": "vn",
      "rank": 54,
      "code": "945879",
      "name": "Hanoi Calido Hotel",
      "city": "Hanoi",
      "address": "16 Pho Nguyen Quang Bich 7"
    },
    {
      "country": "vn",
      "rank": 58,
      "code": "1001024",
      "name": "Signature By M Village Tho Nhuom",
      "city": "Hanoi",
      "address": "84 Tho Nhuom, Tran Hung Dao Ward, Hoan Kiem District, Hanoi City, Vietnam"
    }
  ],
  "Da Lat": [
    {
      "country": "vn",
      "rank": 48,
      "code": "1001582",
      "name": "Best Western Premier Imperial Dalat",
      "city": "Da Lat",
      "address": "57 - 59 Hung Vuong, Ward Xuan Huong - Dalat, Lam Dong"
    },
    {
      "country": "vn",
      "rank": 50,
      "code": "886485",
      "name": "Dalat Paradise Hotel",
      "city": "Da Lat",
      "address": "28 Ba Trieu, Ward 4, Da Lat City, Viet Nam"
    },
    {
      "country": "vn",
      "rank": 91,
      "code": "983182",
      "name": "Tala Dalat Hotel",
      "city": "Da Lat",
      "address": "14/11 Duong Khoi Nghia Bac Son"
    },
    {
      "country": "vn",
      "rank": 93,
      "code": "1001394",
      "name": "Lumina Dalat Premium",
      "city": "Da Lat",
      "address": "63/9 Dong Da Street, Ward 3, Da Lat, Lam Dong"
    },
    {
      "country": "vn",
      "rank": 99,
      "code": "861321",
      "name": "Terracotta Hotel & Resort Dalat",
      "city": "Da Lat",
      "address": "Zone 7.9, Tuyen Lam Lake Tourist Area, Ward Xuan Huong-Da Lat, Lam Dong Province, Vietnam"
    }
  ],
  "Sa Pa": [
    {
      "country": "vn",
      "rank": 49,
      "code": "733705",
      "name": "Muong Thanh Sapa Hotel",
      "city": "Sa Pa",
      "address": "No 44 Ngu Chi Son"
    },
    {
      "country": "vn",
      "rank": 79,
      "code": "741450",
      "name": "DeLaSol Sapa Hotel",
      "city": "Sa Pa",
      "address": "16 Muong Hoa Street"
    },
    {
      "country": "vn",
      "rank": 82,
      "code": "285954",
      "name": "Sapa Green Hotel",
      "city": "Sa Pa",
      "address": "01 Hoang Lien Street"
    },
    {
      "country": "vn",
      "rank": 87,
      "code": "1001332",
      "name": "Cat Cat Galerie d'Art Hotel",
      "city": "Sa Pa",
      "address": "46 Fansipan, Sa Pa, Viet Nam"
    }
  ]
};

/** 영문 도시명 배열로 호텔을 매칭. 여러 도시에 매칭되면 합쳐서 rank 순으로 반환. */
export function findHotelsForCities(cityEnList: string[], limit = 3): Hotel[] {
  const seen = new Set<string>();
  const out: Hotel[] = [];
  for (const c of cityEnList) {
    const list = HOTELS_BY_CITY[c] || [];
    for (const h of list) {
      if (seen.has(h.code)) continue;
      seen.add(h.code);
      out.push(h);
    }
  }
  out.sort((a, b) => a.rank - b.rank);
  return out.slice(0, limit);
}
