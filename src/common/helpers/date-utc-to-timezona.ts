import { DateTime } from 'luxon';

export const dataUtcToTimeZona = (utcDate: Date, timeZona: string) => {
    return DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(timeZona).toFormat('yyyy-MM-dd HH:mm');
}

