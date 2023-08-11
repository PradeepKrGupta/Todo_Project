module.exports.getDate = getDate;

function getDate(){
    let today = new Date();

// To get current date using locale string format where long gives the string and numeric gives the number.
    let option = {
        weekday:'long', 
        year:'numeric', 
        month:'long', 
        day:'numeric'
    };
    let day=today.toLocaleDateString("en-US", option);
    return day;
}

module.exports.getDay = getDay;
function getDay(){
    let today = new Date();
    let option = {
        weekday:'long'
    };
    let day = today.toLocaleDateString("en-US",option);
    return day;
}