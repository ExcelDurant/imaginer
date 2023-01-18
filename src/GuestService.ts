export class GuestService {
    generateDeviceId():string {
        let deviceId = (new Date()).getTime().toString();
        return deviceId;
    }
    storeDeviceId(deviceId:string) {
        localStorage.setItem('deviceId', deviceId);
    }
    getDeviceId():string|null {
        let deviceId = localStorage.getItem('deviceId');
        return deviceId;
    }
    identifyGuest():string {
        if(this.getDeviceId()) {
            return this.getDeviceId()||'';
        } else {
            let deviceId = this.generateDeviceId();
            this.storeDeviceId(deviceId)
            return deviceId;
        }
    }
}