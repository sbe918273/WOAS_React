SCORING = {
    "Verbal aggression":
        [
            "Patient shouts angrily, curses mildly, or makes personal insults",
            "Patient curses viciously, is severely insulting, has temper or outbursts",
            "Patient impulsively threatens violence toward others or self",
            "Patient threatens violence toward others or self repeatedly or deliberately",
        ],
    "Aggression against property":
        [
            "Patient slams door, rips clothing, urinates on floor",
            "Patient throws objects down, kicks furniture, defaces walls",
            "Patient breaks objects, smashes windows",
            "Patient sets fires, throws objects dangerously"
        ],
    "Autoaggression":
        [
            "Patient picks or scratches skin, pulls hair out, hits self (without injury)",
            "Patient bangs head, hits fists into walls, throws self onto floor",
            "Patient inflicts minor cuts, bruises, burns, or welts on self",
            "Patient inflicts major injury on self or makes a suicide attempt"
        ],
    "Physical Aggression":
        [
            "Patient makes menacing gestures, swings at people, grabs at clothing",
            "Patient strikes, pushes, scratches, pulls hair of others (without injury)",
            "Patient attacks others, causing mild injury (bruises, sprain, welts, etc.)",
            "Patient attacks others, causing serious injury"
        ],
    "Caring of Patient":
        [
            "Patient undergoes restrictive practices.",
            "Patient receives given parental medication.",
            "Patient undergoes self-isolation."
        ]
}

WEIGHTING = {
    "Verbal aggression": [1.0, 1.0, 2.0, 3.0, 4.0],
    "Aggression against property": [2.0, 1.0, 2.0, 3.0, 4.0],
    "Autoaggression": [3.0, 1.0, 2.0, 3.0, 4.0],
    "Physical Aggression": [4.0, 1.0, 2.0, 3.0, 4.0],
    "Caring of Patient": [None, "R", "P", "S"]
}

FREQUENCY = [["N", 0.0], ["S", 1.0], ["M", 1.5]]