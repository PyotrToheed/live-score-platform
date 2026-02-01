import dns from 'dns';

const hostname = 'cluster0.ljc5k6j.mongodb.net';

console.log(`Resolving ${hostname}...`);

dns.resolveSrv(`_mongodb._tcp.${hostname}`, (err, addresses) => {
    if (err) {
        console.error('SRV Lookup Error:', err);
    } else {
        console.log('SRV Addresses:', addresses);
        addresses.forEach(addr => {
            dns.lookup(addr.name, (err, ip) => {
                if (err) {
                    console.error(`Lookup error for ${addr.name}:`, err);
                } else {
                    console.log(`${addr.name} -> ${ip}`);
                }
            });
        });
    }
});
