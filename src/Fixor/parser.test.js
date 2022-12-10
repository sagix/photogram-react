import parser, { Line } from "./parser"

it('parse empty string should return empty array', () => {
  let result = parser("");
  expect(result).toEqual([]);
});

it('parse one line', () => {
  let result = parser(`088  A003C003 V     C        16:51:25:10 16:51:28:00 01:01:05:19 01:01:08:09
* FROM CLIP NAME:  210/01-03* CAMA
* LOC: 1:01:06:16  CYAN    208_050_E05 // SPLIT SCREEN
* SOURCE FILE: A003C003_190318BQ`)
  expect(result).toStrictEqual([new Line(
    '208_050_E05',
    '088',
    'A003C003',
    'split screen',
    "210/01-03* CAMA",
    'A003C003_190318BQ',
    { hours: 16, minutes: 51, secondes: 25, images: 10 },
    { hours: 16, minutes: 51, secondes: 28, images: 0 },
    { hours: 1, minutes: 1, secondes: 5, images: 19 },
    { hours: 1, minutes: 1, secondes: 8, images: 9 }
  )]);
  expect(result[0].sourceDuration(25)).toEqual("65.00");
  expect(result[0].recordDuration(25)).toEqual("65.00");
})

it('parse one line', () => {
  let result = parser(`010  A062C006 V     C        15:57:46:02 15:57:49:09 01:00:04:01 01:00:07:08
* FROM CLIP NAME:  201/03-01 CAMA
* LOC: 1:00:05:10  CYAN    201_010_E02 // MULTIPASSE
* SOURCE FILE: A062C006_190417TI `)
  expect(result).toStrictEqual([new Line(
    '201_010_E02',
    '010',
    'A062C006',
    'multipasse',
    "201/03-01 CAMA",
    'A062C006_190417TI',
    { hours: 15, minutes: 57, secondes: 46, images: 2 },
    { hours: 15, minutes: 57, secondes: 49, images: 9 },
    { hours: 1, minutes: 0, secondes: 4, images: 1 },
    { hours: 1, minutes: 0, secondes: 7, images: 8 }
  )]);
})



it('parse one line', () => {
  let result = parser(`010  A062C006 V     C        15:57:46:02 15:57:49:09 01:00:04:01 01:00:07:08
*FROM CLIP NAME:  201/03-01 CAMA
*LOC: 1:00:05:10  CYAN    201_010_E02 // MULTIPASSE
*SOURCE FILE: A062C006_190417TI `)
  expect(result).toStrictEqual([new Line(
    '201_010_E02',
    '010',
    'A062C006',
    'multipasse',
    "201/03-01 CAMA",
    'A062C006_190417TI',
    { hours: 15, minutes: 57, secondes: 46, images: 2 },
    { hours: 15, minutes: 57, secondes: 49, images: 9 },
    { hours: 1, minutes: 0, secondes: 4, images: 1 },
    { hours: 1, minutes: 0, secondes: 7, images: 8 }
  )]);
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
  expect(result).toStrictEqual([new Line(
    '208_050_E05',
    '088',
    'A003C003',
    'split screen',
    "210/01-03* CAMA",
    'A003C003_190318BQ',
    { hours: 16, minutes: 51, secondes: 25, images: 10 },
    { hours: 16, minutes: 51, secondes: 28, images: 0 },
    { hours: 1, minutes: 1, secondes: 5, images: 19 },
    { hours: 1, minutes: 1, secondes: 8, images: 9 }
  ), new Line(
    '204_020',
    '009',
    'B021C011',
    'vfx zoomer + effacer passants     tester sur ce plan le zoom',
    "204/02-01 CAMB",
    'B021C011_190329SN',
    { hours: 17, minutes: 16, secondes: 53, images: 0 },
    { hours: 17, minutes: 16, secondes: 54, images: 10 },
    { hours: 0, minutes: 59, secondes: 51, images: 17 },
    { hours: 0, minutes: 59, secondes: 53, images: 3 }
  )]);
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
  expect(result).toStrictEqual([new Line(
    "001_020",
    "000011",
    'A012C003_190627JC',
    "timewarp progressif + photo + réveil",
    "02/01-03",
    "A012C003_190627JC",
    { hours: 9, minutes: 14, secondes: 3, images: 4 },
    { hours: 9, minutes: 14, secondes: 14, images: 10 },
    { hours: 1, minutes: 0, secondes: 15, images: 1 },
    { hours: 1, minutes: 0, secondes: 25, images: 10 },
  )]);
})

it('parse one line with header', () => {
  let result = parser(`TITLE:   test
FCM: NON-DROP FRAME
000001  B061C018_200217I0                V     C        17:13:19:22 17:13:22:12 01:00:00:00 01:00:02:14
*FROM CLIP NAME:  137/06-01*
*LOC: 01:00:00:17 CYAN    000_001 // TEST 1
*SOURCE FILE: B061C018_200217I0`)
  expect(result).toStrictEqual([new Line(
    "000_001",
    "000001",
    "B061C018_200217I0",
    "test 1",
    "137/06-01*",
    "B061C018_200217I0",
    { hours: 17, minutes: 13, secondes: 19, images: 22 },
    { hours: 17, minutes: 13, secondes: 22, images: 12 },
    { hours: 1, minutes: 0, secondes: 0, images: 0 },
    { hours: 1, minutes: 0, secondes: 2, images: 14 },
  )]);
})

it('parse one line with header', () => {
  let result = parser(`000555  A_0048C002_220908_183153_A1BYR_H V     C        18:34:14:00 18:34:17:03 01:40:12:23 01:40:16:02 
  *FROM CLIP NAME:  686/2-2* CAMA 
  *LOC: 01:00:00:17 CYAN    000_001 // TEST 1
  *SOURCE FILE: A_0048_1BYR`)
  expect(result).toStrictEqual([new Line(
    "000_001",
    "000555",
    "A_0048C002_220908_183153_A1BYR_H",
    "test 1",
    "686/2-2* CAMA",
    "A_0048_1BYR",
    { hours: 18, minutes: 34, secondes: 14, images: 0 },
    { hours: 18, minutes: 34, secondes: 17, images: 3 },
    { hours: 1, minutes: 40, secondes: 12, images: 23 },
    { hours: 1, minutes: 40, secondes: 16, images: 2 },
  )]);
})
