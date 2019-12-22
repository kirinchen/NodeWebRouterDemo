function AccessLogger(n, t) {
    this.qty = n;
    this.time = t;

    this.requests = {};
    // schedule cleanup on a regular interval (every 30 minutes)
    this.interval = setInterval(this.age.bind(this), 30 * 60 * 1000);
}

AccessLogger.prototype = {
    check: function (ip) {
        var info, accessTimes, now, limit, cnt;

        // add this access
        this.add(ip);

        // should always be an info here because we just added it
        info = this.requests[ip];
        accessTimes = info.accessTimes;

        // calc time limits
        now = Date.now();
        limit = now - this.time;


        console.log("accessTimes.length:" + accessTimes.length);
        // short circuit an access that has not even had max qty accesses yet
        if (accessTimes.length < this.qty) {
            return true;
        }
        cnt = 0;
        for (var i = accessTimes.length - 1; i >= 0; i--) {
            if (accessTimes[i] > limit) {
                ++cnt;
            } else {
                // assumes cnts are in time order so no need to look any more
                break;
            }
        }

        return cnt <= this.qty

    },
    add: function (ip) {
        var info = this.requests[ip];
        if (!info) {
            info = { accessTimes: [] };
            this.requests[ip] = info;
        }
        // push this access time into the access array for this IP
        info.accessTimes.push(Date.now());
        //console.log("info.accessTimes.length:" + info.accessTimes.length);
    },
    age: function () {
        // clean up any accesses that have not been here within this.time and are not currently blocked
        var ip, info, accessTimes, now = Date.now(), limit = now - this.time, index;
        for (ip in this.requests) {
            if (this.requests.hasOwnProperty(ip)) {
                info = this.requests[ip];
                accessTimes = info.accessTimes;
                // if not currently blocking this one

                    // if newest access is older than time limit, then nuke the whole item
                    if (!accessTimes.length || accessTimes[accessTimes.length - 1] < limit) {
                        delete this.requests[ip];
                    } 

            }
        }
    }
};

//var accesses = new AccessLogger(10, 3000);

module.exports = AccessLogger;
