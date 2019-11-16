import parser from "./parser"

it('parse empty string should return empty array', () => {
  let result = parser("");
    if(result.length !== 0){
    throw Error("result should be a empty array: " + result.length)
  }
});

it('parse one line', () => {
  let result = parser(`088  A003C003 V     C        16:51:25:10 16:51:28:00 01:01:05:19 01:01:08:09
* FROM CLIP NAME:  210/01-03* CAMA
* LOC: 1:01:06:16  CYAN    208_050_E05 // SPLIT SCREEN
* SOURCE FILE: A003C003_190318BQ`)
  if(result.length !== 1){
    throw Error("result should be an array of size: " + result.length)
  }
  if(result[0].sourceDuration(25) != 65){
    throw Error("sourceDuration should be 65 not : " + result[0].sourceDuration())
  }
  if(result[0].recordDuration(25) != 65){
    throw Error("recordDuration should be 65 not : " + result[0].recordDuration())
  }
})

it('parse one line', () => {
  let result = parser(`010  A062C006 V     C        15:57:46:02 15:57:49:09 01:00:04:01 01:00:07:08
* FROM CLIP NAME:  201/03-01 CAMA
* LOC: 1:00:05:10  CYAN    201_010_E02 // MULTIPASSE
* SOURCE FILE: A062C006_190417TI `)
  if(result.length !== 1){
    throw Error("result should be an array of size: " + result.length)
  }
})

it('parse two lines', () => {
  let result = parser(`088  A003C003 V     C        16:51:25:10 16:51:28:00 01:01:05:19 01:01:08:09
* FROM CLIP NAME:  210/01-03* CAMA
* LOC: 1:01:06:16  CYAN    208_050_E05 // SPLIT SCREEN
* SOURCE FILE: A003C003_190318BQ
009  B021C011 V     C        17:16:53:00 17:16:54:10 00:59:51:17 00:59:53:03
* FROM CLIP NAME:  204/02-01 CAMB
* LOC: 59:52:05    CYAN    204_020 // VFX ZOOMER + EFFACER PASSANTS     TESTER SUR
*  CE PLAN LE ZOOM
* SOURCE FILE: B021C011_190329SN `)
  if(result.length !== 2){
    throw Error("result should be an array of size: " + result.length)
  }
})


it('parse two lines', () => {
  let result = parser(`000009  A012C003_190627JC                V     C        09:14:02:08 09:14:03:04 01:00:14:05 01:00:15:01
 * FROM CLIP NAME:  02/01-03
 * SOURCE FILE: A012C003_190627JC
 000010  BL                               V     C        00:00:00:00 00:00:14:12 01:00:14:10 01:00:28:22
 * SOURCE FILE: (NULL)
 000011  A012C003_190627JC                V     C        09:14:03:04 09:14:14:10 01:00:15:01 01:00:25:10
 M2      A012C003_190627JC                         026.0 09:14:03:04
 * FROM CLIP NAME:  02/01-03
 * LOC: 01:00:18:23 CYAN    001_020 // TIMEWARP PROGRESSIF + PHOTO + RéVEIL
 * SOURCE FILE: A012C003_190627JC
 000012  A012C003_190627JC                V     C        09:14:14:09 09:14:17:21 01:00:25:10 01:00:28:
 * FROM CLIP NAME:  02/01-03
 * SOURCE FILE: A012C003_190627JC`)
  if(result.length !== 1){
    throw Error("result should be an array of size: " + result.length)
  }
})
