// AUTO-GENERATED plan schedules for the DSA Tracker
// -----------------------------------------------------------------------
// data.js (dsaData) remains the ONLY place lesson content (videos/problems)
// lives. This file just maps that same content onto 4 different pacing
// plans, matching the 4 cards on the site:
//   1 Month  - Intensive  (2 content-days merged per calendar day, no rest)
//   2 Months - Fast       (1 content-day per calendar day, no rest)
//   3 Months - Balanced   (5 days study, 2 days rest, weekly)
//   6 Months - Relaxed    (3 days study per week, e.g. Mon/Wed/Fri)
//
// Because all 4 plans pull from the same 61 "content days" of dsaData,
// updating a video link or adding a problem in data.js automatically
// updates all 4 plans - nothing to keep in sync manually.
// -----------------------------------------------------------------------

import { dsaData } from "./data.js";

const contentById = new Map(dsaData.map((d) => [d.day, d]));

export const PLAN_META = {
  "intensive": {
    "id": "intensive",
    "label": "1 Month – Intensive",
    "badge": "Fastest",
    "emoji": "⚡",
    "tagline": "Hardcore mode. Cover 2 topics/day. Best for full-time prep.",
    "approxWeeks": 5,
    "totalCalendarDays": 31,
    "restDaysPerWeek": 0
  },
  "fast": {
    "id": "fast",
    "label": "2 Months – Fast",
    "badge": "Popular",
    "emoji": "🚀",
    "tagline": "One topic per day. Great for dedicated learners with time.",
    "approxWeeks": 9,
    "totalCalendarDays": 61,
    "restDaysPerWeek": 0
  },
  "balanced": {
    "id": "balanced",
    "label": "3 Months – Balanced",
    "badge": "Recommended",
    "emoji": "🎯",
    "tagline": "5 days on, 2 days rest. Sustainable and thorough approach.",
    "approxWeeks": 13,
    "totalCalendarDays": 85,
    "restDaysPerWeek": 2
  },
  "relaxed": {
    "id": "relaxed",
    "label": "6 Months – Relaxed",
    "badge": "Stress-free",
    "emoji": "🌱",
    "tagline": "3 days per week. Perfect for working professionals & students.",
    "approxWeeks": 21,
    "totalCalendarDays": 141,
    "restDaysPerWeek": 4
  }
};

// Each schedule entry is either:
//   { calendarDay, type: "study", contentDays: [n] | [n, n+1] }
//   { calendarDay, type: "rest" }
export const SCHEDULES = {
  "intensive": [
    {
      "calendarDay": 1,
      "type": "study",
      "contentDays": [
        1,
        2
      ]
    },
    {
      "calendarDay": 2,
      "type": "study",
      "contentDays": [
        3,
        4
      ]
    },
    {
      "calendarDay": 3,
      "type": "study",
      "contentDays": [
        5,
        6
      ]
    },
    {
      "calendarDay": 4,
      "type": "study",
      "contentDays": [
        7,
        8
      ]
    },
    {
      "calendarDay": 5,
      "type": "study",
      "contentDays": [
        9,
        10
      ]
    },
    {
      "calendarDay": 6,
      "type": "study",
      "contentDays": [
        11,
        12
      ]
    },
    {
      "calendarDay": 7,
      "type": "study",
      "contentDays": [
        13,
        14
      ]
    },
    {
      "calendarDay": 8,
      "type": "study",
      "contentDays": [
        15,
        16
      ]
    },
    {
      "calendarDay": 9,
      "type": "study",
      "contentDays": [
        17,
        18
      ]
    },
    {
      "calendarDay": 10,
      "type": "study",
      "contentDays": [
        19,
        20
      ]
    },
    {
      "calendarDay": 11,
      "type": "study",
      "contentDays": [
        21,
        22
      ]
    },
    {
      "calendarDay": 12,
      "type": "study",
      "contentDays": [
        23,
        24
      ]
    },
    {
      "calendarDay": 13,
      "type": "study",
      "contentDays": [
        25,
        26
      ]
    },
    {
      "calendarDay": 14,
      "type": "study",
      "contentDays": [
        27,
        28
      ]
    },
    {
      "calendarDay": 15,
      "type": "study",
      "contentDays": [
        29,
        30
      ]
    },
    {
      "calendarDay": 16,
      "type": "study",
      "contentDays": [
        31,
        32
      ]
    },
    {
      "calendarDay": 17,
      "type": "study",
      "contentDays": [
        33,
        34
      ]
    },
    {
      "calendarDay": 18,
      "type": "study",
      "contentDays": [
        35,
        36
      ]
    },
    {
      "calendarDay": 19,
      "type": "study",
      "contentDays": [
        37,
        38
      ]
    },
    {
      "calendarDay": 20,
      "type": "study",
      "contentDays": [
        39,
        40
      ]
    },
    {
      "calendarDay": 21,
      "type": "study",
      "contentDays": [
        41,
        42
      ]
    },
    {
      "calendarDay": 22,
      "type": "study",
      "contentDays": [
        43,
        44
      ]
    },
    {
      "calendarDay": 23,
      "type": "study",
      "contentDays": [
        45,
        46
      ]
    },
    {
      "calendarDay": 24,
      "type": "study",
      "contentDays": [
        47,
        48
      ]
    },
    {
      "calendarDay": 25,
      "type": "study",
      "contentDays": [
        49,
        50
      ]
    },
    {
      "calendarDay": 26,
      "type": "study",
      "contentDays": [
        51,
        52
      ]
    },
    {
      "calendarDay": 27,
      "type": "study",
      "contentDays": [
        53,
        54
      ]
    },
    {
      "calendarDay": 28,
      "type": "study",
      "contentDays": [
        55,
        56
      ]
    },
    {
      "calendarDay": 29,
      "type": "study",
      "contentDays": [
        57,
        58
      ]
    },
    {
      "calendarDay": 30,
      "type": "study",
      "contentDays": [
        59,
        60
      ]
    },
    {
      "calendarDay": 31,
      "type": "study",
      "contentDays": [
        61
      ]
    }
  ],
  "fast": [
    {
      "calendarDay": 1,
      "type": "study",
      "contentDays": [
        1
      ]
    },
    {
      "calendarDay": 2,
      "type": "study",
      "contentDays": [
        2
      ]
    },
    {
      "calendarDay": 3,
      "type": "study",
      "contentDays": [
        3
      ]
    },
    {
      "calendarDay": 4,
      "type": "study",
      "contentDays": [
        4
      ]
    },
    {
      "calendarDay": 5,
      "type": "study",
      "contentDays": [
        5
      ]
    },
    {
      "calendarDay": 6,
      "type": "study",
      "contentDays": [
        6
      ]
    },
    {
      "calendarDay": 7,
      "type": "study",
      "contentDays": [
        7
      ]
    },
    {
      "calendarDay": 8,
      "type": "study",
      "contentDays": [
        8
      ]
    },
    {
      "calendarDay": 9,
      "type": "study",
      "contentDays": [
        9
      ]
    },
    {
      "calendarDay": 10,
      "type": "study",
      "contentDays": [
        10
      ]
    },
    {
      "calendarDay": 11,
      "type": "study",
      "contentDays": [
        11
      ]
    },
    {
      "calendarDay": 12,
      "type": "study",
      "contentDays": [
        12
      ]
    },
    {
      "calendarDay": 13,
      "type": "study",
      "contentDays": [
        13
      ]
    },
    {
      "calendarDay": 14,
      "type": "study",
      "contentDays": [
        14
      ]
    },
    {
      "calendarDay": 15,
      "type": "study",
      "contentDays": [
        15
      ]
    },
    {
      "calendarDay": 16,
      "type": "study",
      "contentDays": [
        16
      ]
    },
    {
      "calendarDay": 17,
      "type": "study",
      "contentDays": [
        17
      ]
    },
    {
      "calendarDay": 18,
      "type": "study",
      "contentDays": [
        18
      ]
    },
    {
      "calendarDay": 19,
      "type": "study",
      "contentDays": [
        19
      ]
    },
    {
      "calendarDay": 20,
      "type": "study",
      "contentDays": [
        20
      ]
    },
    {
      "calendarDay": 21,
      "type": "study",
      "contentDays": [
        21
      ]
    },
    {
      "calendarDay": 22,
      "type": "study",
      "contentDays": [
        22
      ]
    },
    {
      "calendarDay": 23,
      "type": "study",
      "contentDays": [
        23
      ]
    },
    {
      "calendarDay": 24,
      "type": "study",
      "contentDays": [
        24
      ]
    },
    {
      "calendarDay": 25,
      "type": "study",
      "contentDays": [
        25
      ]
    },
    {
      "calendarDay": 26,
      "type": "study",
      "contentDays": [
        26
      ]
    },
    {
      "calendarDay": 27,
      "type": "study",
      "contentDays": [
        27
      ]
    },
    {
      "calendarDay": 28,
      "type": "study",
      "contentDays": [
        28
      ]
    },
    {
      "calendarDay": 29,
      "type": "study",
      "contentDays": [
        29
      ]
    },
    {
      "calendarDay": 30,
      "type": "study",
      "contentDays": [
        30
      ]
    },
    {
      "calendarDay": 31,
      "type": "study",
      "contentDays": [
        31
      ]
    },
    {
      "calendarDay": 32,
      "type": "study",
      "contentDays": [
        32
      ]
    },
    {
      "calendarDay": 33,
      "type": "study",
      "contentDays": [
        33
      ]
    },
    {
      "calendarDay": 34,
      "type": "study",
      "contentDays": [
        34
      ]
    },
    {
      "calendarDay": 35,
      "type": "study",
      "contentDays": [
        35
      ]
    },
    {
      "calendarDay": 36,
      "type": "study",
      "contentDays": [
        36
      ]
    },
    {
      "calendarDay": 37,
      "type": "study",
      "contentDays": [
        37
      ]
    },
    {
      "calendarDay": 38,
      "type": "study",
      "contentDays": [
        38
      ]
    },
    {
      "calendarDay": 39,
      "type": "study",
      "contentDays": [
        39
      ]
    },
    {
      "calendarDay": 40,
      "type": "study",
      "contentDays": [
        40
      ]
    },
    {
      "calendarDay": 41,
      "type": "study",
      "contentDays": [
        41
      ]
    },
    {
      "calendarDay": 42,
      "type": "study",
      "contentDays": [
        42
      ]
    },
    {
      "calendarDay": 43,
      "type": "study",
      "contentDays": [
        43
      ]
    },
    {
      "calendarDay": 44,
      "type": "study",
      "contentDays": [
        44
      ]
    },
    {
      "calendarDay": 45,
      "type": "study",
      "contentDays": [
        45
      ]
    },
    {
      "calendarDay": 46,
      "type": "study",
      "contentDays": [
        46
      ]
    },
    {
      "calendarDay": 47,
      "type": "study",
      "contentDays": [
        47
      ]
    },
    {
      "calendarDay": 48,
      "type": "study",
      "contentDays": [
        48
      ]
    },
    {
      "calendarDay": 49,
      "type": "study",
      "contentDays": [
        49
      ]
    },
    {
      "calendarDay": 50,
      "type": "study",
      "contentDays": [
        50
      ]
    },
    {
      "calendarDay": 51,
      "type": "study",
      "contentDays": [
        51
      ]
    },
    {
      "calendarDay": 52,
      "type": "study",
      "contentDays": [
        52
      ]
    },
    {
      "calendarDay": 53,
      "type": "study",
      "contentDays": [
        53
      ]
    },
    {
      "calendarDay": 54,
      "type": "study",
      "contentDays": [
        54
      ]
    },
    {
      "calendarDay": 55,
      "type": "study",
      "contentDays": [
        55
      ]
    },
    {
      "calendarDay": 56,
      "type": "study",
      "contentDays": [
        56
      ]
    },
    {
      "calendarDay": 57,
      "type": "study",
      "contentDays": [
        57
      ]
    },
    {
      "calendarDay": 58,
      "type": "study",
      "contentDays": [
        58
      ]
    },
    {
      "calendarDay": 59,
      "type": "study",
      "contentDays": [
        59
      ]
    },
    {
      "calendarDay": 60,
      "type": "study",
      "contentDays": [
        60
      ]
    },
    {
      "calendarDay": 61,
      "type": "study",
      "contentDays": [
        61
      ]
    }
  ],
  "balanced": [
    {
      "calendarDay": 1,
      "type": "study",
      "contentDays": [
        1
      ]
    },
    {
      "calendarDay": 2,
      "type": "study",
      "contentDays": [
        2
      ]
    },
    {
      "calendarDay": 3,
      "type": "study",
      "contentDays": [
        3
      ]
    },
    {
      "calendarDay": 4,
      "type": "study",
      "contentDays": [
        4
      ]
    },
    {
      "calendarDay": 5,
      "type": "study",
      "contentDays": [
        5
      ]
    },
    {
      "calendarDay": 6,
      "type": "rest"
    },
    {
      "calendarDay": 7,
      "type": "rest"
    },
    {
      "calendarDay": 8,
      "type": "study",
      "contentDays": [
        6
      ]
    },
    {
      "calendarDay": 9,
      "type": "study",
      "contentDays": [
        7
      ]
    },
    {
      "calendarDay": 10,
      "type": "study",
      "contentDays": [
        8
      ]
    },
    {
      "calendarDay": 11,
      "type": "study",
      "contentDays": [
        9
      ]
    },
    {
      "calendarDay": 12,
      "type": "study",
      "contentDays": [
        10
      ]
    },
    {
      "calendarDay": 13,
      "type": "rest"
    },
    {
      "calendarDay": 14,
      "type": "rest"
    },
    {
      "calendarDay": 15,
      "type": "study",
      "contentDays": [
        11
      ]
    },
    {
      "calendarDay": 16,
      "type": "study",
      "contentDays": [
        12
      ]
    },
    {
      "calendarDay": 17,
      "type": "study",
      "contentDays": [
        13
      ]
    },
    {
      "calendarDay": 18,
      "type": "study",
      "contentDays": [
        14
      ]
    },
    {
      "calendarDay": 19,
      "type": "study",
      "contentDays": [
        15
      ]
    },
    {
      "calendarDay": 20,
      "type": "rest"
    },
    {
      "calendarDay": 21,
      "type": "rest"
    },
    {
      "calendarDay": 22,
      "type": "study",
      "contentDays": [
        16
      ]
    },
    {
      "calendarDay": 23,
      "type": "study",
      "contentDays": [
        17
      ]
    },
    {
      "calendarDay": 24,
      "type": "study",
      "contentDays": [
        18
      ]
    },
    {
      "calendarDay": 25,
      "type": "study",
      "contentDays": [
        19
      ]
    },
    {
      "calendarDay": 26,
      "type": "study",
      "contentDays": [
        20
      ]
    },
    {
      "calendarDay": 27,
      "type": "rest"
    },
    {
      "calendarDay": 28,
      "type": "rest"
    },
    {
      "calendarDay": 29,
      "type": "study",
      "contentDays": [
        21
      ]
    },
    {
      "calendarDay": 30,
      "type": "study",
      "contentDays": [
        22
      ]
    },
    {
      "calendarDay": 31,
      "type": "study",
      "contentDays": [
        23
      ]
    },
    {
      "calendarDay": 32,
      "type": "study",
      "contentDays": [
        24
      ]
    },
    {
      "calendarDay": 33,
      "type": "study",
      "contentDays": [
        25
      ]
    },
    {
      "calendarDay": 34,
      "type": "rest"
    },
    {
      "calendarDay": 35,
      "type": "rest"
    },
    {
      "calendarDay": 36,
      "type": "study",
      "contentDays": [
        26
      ]
    },
    {
      "calendarDay": 37,
      "type": "study",
      "contentDays": [
        27
      ]
    },
    {
      "calendarDay": 38,
      "type": "study",
      "contentDays": [
        28
      ]
    },
    {
      "calendarDay": 39,
      "type": "study",
      "contentDays": [
        29
      ]
    },
    {
      "calendarDay": 40,
      "type": "study",
      "contentDays": [
        30
      ]
    },
    {
      "calendarDay": 41,
      "type": "rest"
    },
    {
      "calendarDay": 42,
      "type": "rest"
    },
    {
      "calendarDay": 43,
      "type": "study",
      "contentDays": [
        31
      ]
    },
    {
      "calendarDay": 44,
      "type": "study",
      "contentDays": [
        32
      ]
    },
    {
      "calendarDay": 45,
      "type": "study",
      "contentDays": [
        33
      ]
    },
    {
      "calendarDay": 46,
      "type": "study",
      "contentDays": [
        34
      ]
    },
    {
      "calendarDay": 47,
      "type": "study",
      "contentDays": [
        35
      ]
    },
    {
      "calendarDay": 48,
      "type": "rest"
    },
    {
      "calendarDay": 49,
      "type": "rest"
    },
    {
      "calendarDay": 50,
      "type": "study",
      "contentDays": [
        36
      ]
    },
    {
      "calendarDay": 51,
      "type": "study",
      "contentDays": [
        37
      ]
    },
    {
      "calendarDay": 52,
      "type": "study",
      "contentDays": [
        38
      ]
    },
    {
      "calendarDay": 53,
      "type": "study",
      "contentDays": [
        39
      ]
    },
    {
      "calendarDay": 54,
      "type": "study",
      "contentDays": [
        40
      ]
    },
    {
      "calendarDay": 55,
      "type": "rest"
    },
    {
      "calendarDay": 56,
      "type": "rest"
    },
    {
      "calendarDay": 57,
      "type": "study",
      "contentDays": [
        41
      ]
    },
    {
      "calendarDay": 58,
      "type": "study",
      "contentDays": [
        42
      ]
    },
    {
      "calendarDay": 59,
      "type": "study",
      "contentDays": [
        43
      ]
    },
    {
      "calendarDay": 60,
      "type": "study",
      "contentDays": [
        44
      ]
    },
    {
      "calendarDay": 61,
      "type": "study",
      "contentDays": [
        45
      ]
    },
    {
      "calendarDay": 62,
      "type": "rest"
    },
    {
      "calendarDay": 63,
      "type": "rest"
    },
    {
      "calendarDay": 64,
      "type": "study",
      "contentDays": [
        46
      ]
    },
    {
      "calendarDay": 65,
      "type": "study",
      "contentDays": [
        47
      ]
    },
    {
      "calendarDay": 66,
      "type": "study",
      "contentDays": [
        48
      ]
    },
    {
      "calendarDay": 67,
      "type": "study",
      "contentDays": [
        49
      ]
    },
    {
      "calendarDay": 68,
      "type": "study",
      "contentDays": [
        50
      ]
    },
    {
      "calendarDay": 69,
      "type": "rest"
    },
    {
      "calendarDay": 70,
      "type": "rest"
    },
    {
      "calendarDay": 71,
      "type": "study",
      "contentDays": [
        51
      ]
    },
    {
      "calendarDay": 72,
      "type": "study",
      "contentDays": [
        52
      ]
    },
    {
      "calendarDay": 73,
      "type": "study",
      "contentDays": [
        53
      ]
    },
    {
      "calendarDay": 74,
      "type": "study",
      "contentDays": [
        54
      ]
    },
    {
      "calendarDay": 75,
      "type": "study",
      "contentDays": [
        55
      ]
    },
    {
      "calendarDay": 76,
      "type": "rest"
    },
    {
      "calendarDay": 77,
      "type": "rest"
    },
    {
      "calendarDay": 78,
      "type": "study",
      "contentDays": [
        56
      ]
    },
    {
      "calendarDay": 79,
      "type": "study",
      "contentDays": [
        57
      ]
    },
    {
      "calendarDay": 80,
      "type": "study",
      "contentDays": [
        58
      ]
    },
    {
      "calendarDay": 81,
      "type": "study",
      "contentDays": [
        59
      ]
    },
    {
      "calendarDay": 82,
      "type": "study",
      "contentDays": [
        60
      ]
    },
    {
      "calendarDay": 83,
      "type": "rest"
    },
    {
      "calendarDay": 84,
      "type": "rest"
    },
    {
      "calendarDay": 85,
      "type": "study",
      "contentDays": [
        61
      ]
    }
  ],
  "relaxed": [
    {
      "calendarDay": 1,
      "type": "study",
      "contentDays": [
        1
      ]
    },
    {
      "calendarDay": 2,
      "type": "rest"
    },
    {
      "calendarDay": 3,
      "type": "study",
      "contentDays": [
        2
      ]
    },
    {
      "calendarDay": 4,
      "type": "rest"
    },
    {
      "calendarDay": 5,
      "type": "study",
      "contentDays": [
        3
      ]
    },
    {
      "calendarDay": 6,
      "type": "rest"
    },
    {
      "calendarDay": 7,
      "type": "rest"
    },
    {
      "calendarDay": 8,
      "type": "study",
      "contentDays": [
        4
      ]
    },
    {
      "calendarDay": 9,
      "type": "rest"
    },
    {
      "calendarDay": 10,
      "type": "study",
      "contentDays": [
        5
      ]
    },
    {
      "calendarDay": 11,
      "type": "rest"
    },
    {
      "calendarDay": 12,
      "type": "study",
      "contentDays": [
        6
      ]
    },
    {
      "calendarDay": 13,
      "type": "rest"
    },
    {
      "calendarDay": 14,
      "type": "rest"
    },
    {
      "calendarDay": 15,
      "type": "study",
      "contentDays": [
        7
      ]
    },
    {
      "calendarDay": 16,
      "type": "rest"
    },
    {
      "calendarDay": 17,
      "type": "study",
      "contentDays": [
        8
      ]
    },
    {
      "calendarDay": 18,
      "type": "rest"
    },
    {
      "calendarDay": 19,
      "type": "study",
      "contentDays": [
        9
      ]
    },
    {
      "calendarDay": 20,
      "type": "rest"
    },
    {
      "calendarDay": 21,
      "type": "rest"
    },
    {
      "calendarDay": 22,
      "type": "study",
      "contentDays": [
        10
      ]
    },
    {
      "calendarDay": 23,
      "type": "rest"
    },
    {
      "calendarDay": 24,
      "type": "study",
      "contentDays": [
        11
      ]
    },
    {
      "calendarDay": 25,
      "type": "rest"
    },
    {
      "calendarDay": 26,
      "type": "study",
      "contentDays": [
        12
      ]
    },
    {
      "calendarDay": 27,
      "type": "rest"
    },
    {
      "calendarDay": 28,
      "type": "rest"
    },
    {
      "calendarDay": 29,
      "type": "study",
      "contentDays": [
        13
      ]
    },
    {
      "calendarDay": 30,
      "type": "rest"
    },
    {
      "calendarDay": 31,
      "type": "study",
      "contentDays": [
        14
      ]
    },
    {
      "calendarDay": 32,
      "type": "rest"
    },
    {
      "calendarDay": 33,
      "type": "study",
      "contentDays": [
        15
      ]
    },
    {
      "calendarDay": 34,
      "type": "rest"
    },
    {
      "calendarDay": 35,
      "type": "rest"
    },
    {
      "calendarDay": 36,
      "type": "study",
      "contentDays": [
        16
      ]
    },
    {
      "calendarDay": 37,
      "type": "rest"
    },
    {
      "calendarDay": 38,
      "type": "study",
      "contentDays": [
        17
      ]
    },
    {
      "calendarDay": 39,
      "type": "rest"
    },
    {
      "calendarDay": 40,
      "type": "study",
      "contentDays": [
        18
      ]
    },
    {
      "calendarDay": 41,
      "type": "rest"
    },
    {
      "calendarDay": 42,
      "type": "rest"
    },
    {
      "calendarDay": 43,
      "type": "study",
      "contentDays": [
        19
      ]
    },
    {
      "calendarDay": 44,
      "type": "rest"
    },
    {
      "calendarDay": 45,
      "type": "study",
      "contentDays": [
        20
      ]
    },
    {
      "calendarDay": 46,
      "type": "rest"
    },
    {
      "calendarDay": 47,
      "type": "study",
      "contentDays": [
        21
      ]
    },
    {
      "calendarDay": 48,
      "type": "rest"
    },
    {
      "calendarDay": 49,
      "type": "rest"
    },
    {
      "calendarDay": 50,
      "type": "study",
      "contentDays": [
        22
      ]
    },
    {
      "calendarDay": 51,
      "type": "rest"
    },
    {
      "calendarDay": 52,
      "type": "study",
      "contentDays": [
        23
      ]
    },
    {
      "calendarDay": 53,
      "type": "rest"
    },
    {
      "calendarDay": 54,
      "type": "study",
      "contentDays": [
        24
      ]
    },
    {
      "calendarDay": 55,
      "type": "rest"
    },
    {
      "calendarDay": 56,
      "type": "rest"
    },
    {
      "calendarDay": 57,
      "type": "study",
      "contentDays": [
        25
      ]
    },
    {
      "calendarDay": 58,
      "type": "rest"
    },
    {
      "calendarDay": 59,
      "type": "study",
      "contentDays": [
        26
      ]
    },
    {
      "calendarDay": 60,
      "type": "rest"
    },
    {
      "calendarDay": 61,
      "type": "study",
      "contentDays": [
        27
      ]
    },
    {
      "calendarDay": 62,
      "type": "rest"
    },
    {
      "calendarDay": 63,
      "type": "rest"
    },
    {
      "calendarDay": 64,
      "type": "study",
      "contentDays": [
        28
      ]
    },
    {
      "calendarDay": 65,
      "type": "rest"
    },
    {
      "calendarDay": 66,
      "type": "study",
      "contentDays": [
        29
      ]
    },
    {
      "calendarDay": 67,
      "type": "rest"
    },
    {
      "calendarDay": 68,
      "type": "study",
      "contentDays": [
        30
      ]
    },
    {
      "calendarDay": 69,
      "type": "rest"
    },
    {
      "calendarDay": 70,
      "type": "rest"
    },
    {
      "calendarDay": 71,
      "type": "study",
      "contentDays": [
        31
      ]
    },
    {
      "calendarDay": 72,
      "type": "rest"
    },
    {
      "calendarDay": 73,
      "type": "study",
      "contentDays": [
        32
      ]
    },
    {
      "calendarDay": 74,
      "type": "rest"
    },
    {
      "calendarDay": 75,
      "type": "study",
      "contentDays": [
        33
      ]
    },
    {
      "calendarDay": 76,
      "type": "rest"
    },
    {
      "calendarDay": 77,
      "type": "rest"
    },
    {
      "calendarDay": 78,
      "type": "study",
      "contentDays": [
        34
      ]
    },
    {
      "calendarDay": 79,
      "type": "rest"
    },
    {
      "calendarDay": 80,
      "type": "study",
      "contentDays": [
        35
      ]
    },
    {
      "calendarDay": 81,
      "type": "rest"
    },
    {
      "calendarDay": 82,
      "type": "study",
      "contentDays": [
        36
      ]
    },
    {
      "calendarDay": 83,
      "type": "rest"
    },
    {
      "calendarDay": 84,
      "type": "rest"
    },
    {
      "calendarDay": 85,
      "type": "study",
      "contentDays": [
        37
      ]
    },
    {
      "calendarDay": 86,
      "type": "rest"
    },
    {
      "calendarDay": 87,
      "type": "study",
      "contentDays": [
        38
      ]
    },
    {
      "calendarDay": 88,
      "type": "rest"
    },
    {
      "calendarDay": 89,
      "type": "study",
      "contentDays": [
        39
      ]
    },
    {
      "calendarDay": 90,
      "type": "rest"
    },
    {
      "calendarDay": 91,
      "type": "rest"
    },
    {
      "calendarDay": 92,
      "type": "study",
      "contentDays": [
        40
      ]
    },
    {
      "calendarDay": 93,
      "type": "rest"
    },
    {
      "calendarDay": 94,
      "type": "study",
      "contentDays": [
        41
      ]
    },
    {
      "calendarDay": 95,
      "type": "rest"
    },
    {
      "calendarDay": 96,
      "type": "study",
      "contentDays": [
        42
      ]
    },
    {
      "calendarDay": 97,
      "type": "rest"
    },
    {
      "calendarDay": 98,
      "type": "rest"
    },
    {
      "calendarDay": 99,
      "type": "study",
      "contentDays": [
        43
      ]
    },
    {
      "calendarDay": 100,
      "type": "rest"
    },
    {
      "calendarDay": 101,
      "type": "study",
      "contentDays": [
        44
      ]
    },
    {
      "calendarDay": 102,
      "type": "rest"
    },
    {
      "calendarDay": 103,
      "type": "study",
      "contentDays": [
        45
      ]
    },
    {
      "calendarDay": 104,
      "type": "rest"
    },
    {
      "calendarDay": 105,
      "type": "rest"
    },
    {
      "calendarDay": 106,
      "type": "study",
      "contentDays": [
        46
      ]
    },
    {
      "calendarDay": 107,
      "type": "rest"
    },
    {
      "calendarDay": 108,
      "type": "study",
      "contentDays": [
        47
      ]
    },
    {
      "calendarDay": 109,
      "type": "rest"
    },
    {
      "calendarDay": 110,
      "type": "study",
      "contentDays": [
        48
      ]
    },
    {
      "calendarDay": 111,
      "type": "rest"
    },
    {
      "calendarDay": 112,
      "type": "rest"
    },
    {
      "calendarDay": 113,
      "type": "study",
      "contentDays": [
        49
      ]
    },
    {
      "calendarDay": 114,
      "type": "rest"
    },
    {
      "calendarDay": 115,
      "type": "study",
      "contentDays": [
        50
      ]
    },
    {
      "calendarDay": 116,
      "type": "rest"
    },
    {
      "calendarDay": 117,
      "type": "study",
      "contentDays": [
        51
      ]
    },
    {
      "calendarDay": 118,
      "type": "rest"
    },
    {
      "calendarDay": 119,
      "type": "rest"
    },
    {
      "calendarDay": 120,
      "type": "study",
      "contentDays": [
        52
      ]
    },
    {
      "calendarDay": 121,
      "type": "rest"
    },
    {
      "calendarDay": 122,
      "type": "study",
      "contentDays": [
        53
      ]
    },
    {
      "calendarDay": 123,
      "type": "rest"
    },
    {
      "calendarDay": 124,
      "type": "study",
      "contentDays": [
        54
      ]
    },
    {
      "calendarDay": 125,
      "type": "rest"
    },
    {
      "calendarDay": 126,
      "type": "rest"
    },
    {
      "calendarDay": 127,
      "type": "study",
      "contentDays": [
        55
      ]
    },
    {
      "calendarDay": 128,
      "type": "rest"
    },
    {
      "calendarDay": 129,
      "type": "study",
      "contentDays": [
        56
      ]
    },
    {
      "calendarDay": 130,
      "type": "rest"
    },
    {
      "calendarDay": 131,
      "type": "study",
      "contentDays": [
        57
      ]
    },
    {
      "calendarDay": 132,
      "type": "rest"
    },
    {
      "calendarDay": 133,
      "type": "rest"
    },
    {
      "calendarDay": 134,
      "type": "study",
      "contentDays": [
        58
      ]
    },
    {
      "calendarDay": 135,
      "type": "rest"
    },
    {
      "calendarDay": 136,
      "type": "study",
      "contentDays": [
        59
      ]
    },
    {
      "calendarDay": 137,
      "type": "rest"
    },
    {
      "calendarDay": 138,
      "type": "study",
      "contentDays": [
        60
      ]
    },
    {
      "calendarDay": 139,
      "type": "rest"
    },
    {
      "calendarDay": 140,
      "type": "rest"
    },
    {
      "calendarDay": 141,
      "type": "study",
      "contentDays": [
        61
      ]
    }
  ]
};

export const PLAN_IDS = Object.keys(PLAN_META);

export function getPlanMaxDay(planId) {
  const s = SCHEDULES[planId];
  if (!s) return 0;
  return s[s.length - 1].calendarDay;
}

export function getPlanId(scheduleType) {
  if (scheduleType === "1month") return "intensive";
  if (scheduleType === "2month") return "fast";
  if (scheduleType === "3month") return "balanced";
  if (scheduleType === "6month") return "relaxed";
  return "balanced";
}

export function getCalendarDayForContentDay(planId, contentDay) {
  const s = SCHEDULES[planId];
  if (!s) return 1;
  const entry = s.find((d) => d.type === "study" && d.contentDays.includes(contentDay));
  return entry ? entry.calendarDay : 1;
}

// Returns a fully-resolved day: rest days pass through as-is; study days get
// their tasks/problems merged in (live) from dsaData via contentDays.
export function getPlanDay(planId, calendarDay) {
  const s = SCHEDULES[planId];
  if (!s) return null;
  const n = Number(calendarDay);
  if (!Number.isInteger(n)) return null;
  const entry = s.find((d) => d.calendarDay === n);
  if (!entry) return null;
  if (entry.type === "rest") return entry;

  const tasks = [];
  const problems = [];
  for (const cd of entry.contentDays) {
    const content = contentById.get(cd);
    if (content) {
      tasks.push(
        ...content.tasks.map((t, idx) => ({
          ...t,
          contentDay: cd,
          originalIndex: idx,
        }))
      );
      problems.push(
        ...content.problems.map((p, idx) => ({
          ...p,
          contentDay: cd,
          originalIndex: idx,
        }))
      );
    }
  }
  return { ...entry, tasks, problems };
}

export function getPlanProgress(planId, calendarDay) {
  const s = SCHEDULES[planId];
  if (!s) return null;
  const total = s.length;
  const studyTotal = s.filter((d) => d.type === "study").length;
  const studyDone = s.filter((d) => d.type === "study" && d.calendarDay <= calendarDay).length;
  return { total, studyTotal, studyDone, percent: Math.round((studyDone / studyTotal) * 100) };
}

