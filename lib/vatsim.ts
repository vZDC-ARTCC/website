export const getRating = (rating: number) => {
    switch (rating) {
        case 0:
            return "SUS";
        case 1:
            return "OBS";
        case 2:
            return "S1";
        case 3:
            return "S2";
        case 4:
            return "S3";
        case 5:
            return "C1";
        case 6:
            return "C2";
        case 7:
            return "C3";
        case 8:
            return "I1";
        case 9:
            return "I2";
        case 10:
            return "I3";
        case 11:
            return "SUP";
        case 12:
            return "ADM";
        default:
            return "UNK";
    }
}