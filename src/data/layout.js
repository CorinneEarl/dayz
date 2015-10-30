import moment from 'moment';
import range  from 'moment-range';
import EventLayout from './event-layout';

function cacheKey(day){
    return day.format('YYYYMMDD');
}

class Layout {

    constructor(events, range, options) {
        this.options = options;
        this.cache = Object.create(null);
        this.range = range;
        this.events = events;
        let multiDayCount = 0;
        const cacheMethod = ('day' === options.display) ? 'addtoDaysCache' : 'calculateSpanningLayout';
        if (! events){ return }
        events.each( function(event){
            // we only care about events that are in the range we were provided
            if (range.overlaps(event.range())){
                this[cacheMethod](event);
                if (!event.isSingleDay()){
                    multiDayCount += 1;
                }
            }
        }, this);
        this.multiDayCount = multiDayCount;
        this.calculateStacking();
    }

    propsForAllDayEventContainer() {
        const style = this.multiDayCount ? { flexBasis: this.multiDayCount*20} : { display: 'none' }
        return { className: 'all-day', style };
    }

    hourRangeForWeek(firstDay){
        const day = firstDay.clone();
        const range = [7, 19];
        for (let i=0; i<7; i++){
            const layouts = this.forDay(day);
            for (let i=0; i < layouts.length; i++){
                range[0] = Math.min( layouts[i].event.start().hour(), range[0] );
                range[1] = Math.max( layouts[i].event.end().hour(),   range[1] );
            }
            day.add(1, 'day');
        }
        return range;
    }

    calculateStacking(){
        const day = this.range.start.clone().startOf('week');
        do {
            const weeklyEvents = [];
            for (let i=0; i<7; i++){
                const layouts = this.forDay(day);
                if (layouts.length){
                    this.cache[ cacheKey(day) ] = layouts;
                    for (const layout of layouts){
                        weeklyEvents.push(layout);
                    }
                }
                day.add(1, 'day')
            }

            for (let i=0; i < weeklyEvents.length; i++){
                const layout = weeklyEvents[i];
                layout.stack = 0;
                // find out how many layouts are before this one
                for (let pi=i-1; pi>=0; pi--){
                    const se = weeklyEvents[pi];

                    if (se.event.range().start.isSame(layout.event.range().start,'d')){
                        layout.stack=1;  // the one right before this has the same day so we only stack one high
                        break;
                    } else {
                        layout.stack++;
                    }
                }
            }
        } while(!day.isAfter(this.range.end));
    }

    isDateOutsideRange(date){
        return ('month' === this.options.display && !this.range.contains(date));
    }

    forDay(day){
        return this.cache[ cacheKey(day) ] || [];
    }

    // a single day is easy, just add the event to that day
    addtoDaysCache(event){
        const layout = new EventLayout(this, event, this.range);
        this.addToCache(this.range.start, layout);
    }

    // other layouts must break at week boundaries, with indicators if they were/are continuing
    calculateSpanningLayout(event){
        const end = moment.min(this.range.end, event.range().end);
        const start = moment.max(this.range.start, event.range().start);
        do {
            const layout = new EventLayout(this, event, moment.range(start, start.clone().endOf('week')) );
            this.addToCache(start, layout );
            // go to first day of next week
            start.add(7-start.day(), 'day');
        } while (!start.isAfter(end));

    }

    isEditing(event){
        return this.events.editing == event;
    }

    addToCache(date, eventLayout){
        let found = false;
        outer_block: {
            for (let key in this.cache ){
                for (let layout of this.cache[key]){
                    if (layout.event == eventLayout.event){
                        found = true;
                        break outer_block;
                    }
                }
            }
        }
        if (!found){
            eventLayout.first = true;
        }
        const dayCache = this.cache[ cacheKey(date) ] || (this.cache[ cacheKey(date) ]=[]);
        dayCache.push(eventLayout);
    }

    displayingAs(){
        return this.options.display;
    }

}


export default Layout;
