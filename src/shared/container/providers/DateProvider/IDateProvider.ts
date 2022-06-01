interface IDateProvider {
    compareInHours(start_date: Date, end_date: Date): number;
    convertToUTC(date: Date): string;
    dateNow(): Date;
    addOneDayInDate(date: Date): Date;
}

export { IDateProvider };