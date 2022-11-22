// Class
class saveAsync {

    // Constructor
    constructor(db) {
        this.db = db;
        this.list = [];
        this.callbacks = {};
        this.using = false;
        return this;
    }

    on(where, callback) {

        if (!Array.isArray(this.callbacks[where])) {
            this.callbacks[where] = [];
        }

        this.callbacks[where].push(callback);
        return true;

    }

    _runCallbacks(type, data) {
        if (Array.isArray(this.callbacks[type])) {
            for (const item in this.callbacks[type]) {
                if (typeof this.callbacks[type][item] === 'function') {
                    this.callbacks[type][item](data);
                }
            }
        }
    }

    // Action
    action() {

        // Insert
        if (this.list.length > 0) {

            // Get Item
            const post = this.list.shift();
            const tinyThis = this;

            // Try
            try {
                if (typeof post.where !== "string") {
                    if (post.data) {

                        this.db[post.type](post.data).then(() => {
                            this._runCallbacks(post.type, post.data);
                            tinyThis.action(); return;
                        }).catch(err => { console.error(err); return; });

                    } else {
                        this.db[post.type]().then(() => {
                            this._runCallbacks(post.type);
                            tinyThis.action(); return;
                        }).catch(err => { console.error(err); return; });
                    }
                } else {
                    if (post.data) {
                        this.db.child(post.where)[post.type](post.data).then(() => {
                            this._runCallbacks(post.type, post.data);
                            tinyThis.action(); return;
                        }).catch(err => { console.error(err); return; });
                    } else {
                        this.db.child(post.where)[post.type]().then(() => {
                            this._runCallbacks(post.type);
                            tinyThis.action(); return;
                        }).catch(err => { console.error(err); return; });
                    }
                }
            }

            // Error
            catch (err) { console.error(err); }
        }

        // Nope
        else { this.using = false; }

        // Complete
        return;

    }

    // Insert
    insert(data = {}, type = 'set', where = null) {

        // Insert
        if (data !== null) {
            if (where !== null) {
                this.list.push({ where: String(where), data: data, type: type });
            } else {
                this.list.push({ data: data, type: type });
            }
        } else {
            if (where !== null) {
                this.list.push({ where: String(where), type: type });
            } else {
                this.list.push({ type: type });
            }
        }

        if (!this.using) {
            this.using = true;
            this.action();
        }

        return;
    }

};

// Moudule
module.exports = saveAsync;