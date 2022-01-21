module.exports = {
    flatten: data => {
        let flat = []
        for(let date in data) {
            flat = flat.concat(data[date])
        }
        return flat
    },

    thisWeek: data => {
        let lastSunday = new Date();
        lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay() % 7);
    
        return data[lastSunday.toLocaleDateString()]
    }
}