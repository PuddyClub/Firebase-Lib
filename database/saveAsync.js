// Class
class saveAsync {

    // Constructor
    constructor(db) {
        this.db = db;
        this.list = [];
        this.using = false;
        return this;
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
                        this.db[post.type](post.data).then(() => { tinyThis.action(); return; }).catch(err => { console.error(err); return; });
                    } else {
                        this.db[post.type]().then(() => { tinyThis.action(); return; }).catch(err => { console.error(err); return; });
                    }
                } else {
                    if (post.data) {
                        this.db.child(post.where)[post.type](post.data).then(() => { tinyThis.action(); return; }).catch(err => { console.error(err); return; });
                    } else {
                        this.db.child(post.where)[post.type]().then(() => { tinyThis.action(); return; }).catch(err => { console.error(err); return; });
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