(function () {
    print('----- database init start -----');

    try {
        /* ① 이미 초기화돼 있으면 패스 */
        rs.status();
        return;
    } catch (e) {
        if (e.code !== 94) throw e;         // 94 = NotYetInitialized
    }


    rs.initiate();
    print('----- rs.initiate() done (no host specified) -----');


    while (!rs.isMaster().ismaster) sleep(1000);
    print('----- PRIMARY ready -----');

    // create root
    var admin = db.getSiblingDB('admin');
    if (!admin.getUser('root')) {
        admin.createUser({
            user: 'root',
            pwd:  '1111',
            roles:[{ role:'root', db:'admin' }]
        });
        print('----- root user created -----');
    } else {
        print('----- root user already exists -----');
    }
})();