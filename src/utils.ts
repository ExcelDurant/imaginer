import axios from "axios";

export const apiUrl = 'https://yango.gnopaexcel.com/';
// export const apiUrl = 'http://127.0.0.1:5000/';

export async function axiosPost(url: string, body: any) {
    let config = {
        headers: { "Content-Type": "application/json" }
    }
    let res = await axios.post(url, JSON.stringify(body), config);
    if (res.status >= 200 && res.status < 300) {
        // console.log(res);
        let data = res.data;
        return data;
    }
    // console.log(res);
    const { message } = await res.data;
    // showErrorPop(message);
    // console.log(message);
    window.alert("an error occured")
    throw new Error(message);
}

export function getReadableDate(date: any) {
    let newDate = new Date(date._seconds * 1000 + date._nanoseconds/1000000);
    // return newDate;
    let minutes = newDate.getMinutes();
    // minutes = (minutes > 9)?minutes:("0"+minutes);
    return newDate.toDateString() + " " + newDate.getHours() + ":" + minutes;
}