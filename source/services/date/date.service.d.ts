import { ITimeUtility } from '../time/time.service';
import { CompareResult } from '../../types/compareResult';
export declare var serviceName: string;
export interface IMonth {
    name: string;
    days(year?: number): number;
}
export interface IDateValue {
    years: number;
    months: number;
    days: number;
}
export interface IDateUtility {
    getFullString(month: number): string;
    getDays(month: number, year?: number): number;
    subtractDates(start: string | Date, end: string | Date, dateFormat?: string): IDateValue;
    subtractDateInDays(start: string | Date, end: string | Date, dateFormat?: string): number;
    subtractDateInMilliseconds(start: string | Date, end: string | Date, dateFormat?: string): number;
    compareDates(date1: string | Date, date2: string | Date, dateFormat?: string): CompareResult;
    dateInRange(date: string | Date, rangeStart: string | Date, rangeEnd: string | Date): boolean;
    getDate(date: string | Date, dateFormat?: string): Date;
    isDate(date: string | Date, dateFormat?: string): boolean;
    getNow(): Date;
}
export declare class DateUtility {
    private moment;
    private time;
    static $inject: string[];
    constructor(moment: moment.MomentStatic, time: ITimeUtility);
    month: IMonth[];
    private baseFormat;
    private isLeapYear(year?);
    getFullString(month: number): string;
    getDays(month: number, year?: number): number;
    subtractDates(start: string | Date, end: string | Date, dateFormat?: string): IDateValue;
    subtractDateInDays(start: string | Date, end: string | Date, dateFormat?: string): number;
    subtractDateInMilliseconds(start: string | Date, end: string | Date, dateFormat?: string): number;
    compareDates(date1: string | Date, date2: string | Date, dateFormat?: string): CompareResult;
    dateInRange(date: string | Date, rangeStart: string | Date, rangeEnd: string | Date): boolean;
    getDate(date: string | Date, dateFormat?: string): Date;
    isDate(date: string | Date, dateFormat?: string): boolean;
    getNow(): Date;
    private format(customFormat);
}
