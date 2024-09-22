module.exports = function ({ models, api }) {
    const Users = models.use('Users');

    async function getInfo(id) {
        return (await api.getUserInfo(id))[id];
    }

    async function getNameUser(id) {
        try {
            if (global.data.userName.has(id)) {
                return global.data.userName.get(id);
            } else if (global.data.allUserID.includes(id)) {
                const userInfo = await getData(id);
                if (userInfo && userInfo.name) {
                    global.data.userName.set(id, userInfo.name);
                    return userInfo.name;
                } else {
                    const apiUserInfo = await getInfo(id);
                    if (apiUserInfo && apiUserInfo.name) {
                        global.data.userName.set(id, apiUserInfo.name);
                        return apiUserInfo.name;
                    } else {
                        return "Unknown User";
                    }
                }
            } else {
                const apiUserInfo = await getInfo(id);
                if (apiUserInfo && apiUserInfo.name) {
                    global.data.userName.set(id, apiUserInfo.name);
                    return apiUserInfo.name;
                } else {
                    return "Unknown User";
                }
            }
        } catch (error) {
            console.error(error);
            return "Unknown User";
        }
    }

    async function getAll(...data) {
        var where, attributes;
        for (const i of data) {
            if (typeof i != 'object') throw global.getText("users", "needObjectOrArray");
            if (Array.isArray(i)) attributes = i;
            else where = i;
        }
        try {
            return (await Users.findAll({ where, attributes })).map(e => e.get({ plain: true }));
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function getData(userID) {
        try {
            const data = await Users.findOne({ where: { userID } });
            if (data) return data.get({ plain: true });
            else return false;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function setData(userID, options = {}) {
        if (typeof options != 'object' && !Array.isArray(options)) throw global.getText("users", "needObject");
        try {
            const user = await Users.findOne({ where: { userID } });
            if (user) {
                await user.update(options);
            } else {
                await createData(userID, options);
            }
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function delData(userID) {
        try {
            const user = await Users.findOne({ where: { userID } });
            if (user) {
                await user.destroy();
                return true;
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function createData(userID, defaults = {}) {
        if (typeof defaults != 'object' && !Array.isArray(defaults)) throw global.getText("users", "needObject");
        try {
            await Users.findOrCreate({ where: { userID }, defaults });
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    return {
        getInfo,
        getNameUser,
        getAll,
        getData,
        setData,
        delData,
        createData
    };
};
