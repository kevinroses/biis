import { format, add, getDay } from 'date-fns';

const currentDate = format(new Date(), 'yyyy/MM/dd HH:mm');
const nextDay = format(add(new Date(), { days: 1 }), 'yyyy/MM/dd');
const today = format(new Date(), 'EEEE');
const tomorrow = format(add(new Date(), { days: 1 }), 'EEEE');
const currentDateTime = new Date();
const todayTime = format(currentDateTime, 'HH:mm');
