interface IDateProvider {
    compareInHours(start_date: Date, end_date: Date): number;
    compareInDays(start_date: Date, end_date: Date): number;
    compareIfBefore(start_date: Date, end_date: Date): boolean;
    convertToUTC(date: Date): string;
    dateNow(): Date;
    addOneDayInDate(date: Date): Date;
    addDaysInDate(days: number, date: Date): Date;
    addHoursInDate(hours: number, date: Date): Date;
}

export { IDateProvider };
