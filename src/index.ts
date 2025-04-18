import { AppDataSource } from "./data-source";
import express from 'express';
import * as fs from "fs";
import * as path from "path";
import { Talents } from "./entity/Talents";

const app = express();
const port = 3000;
const startTime = Date.now();

const playerRoutes = require('./routes/PlayerRoutes');
const itemRoutes = require('./routes/ItemRoutes');
const weaponRoutes = require('./routes/WeaponRoutes'); 
const playertalentsRoutes = require('./routes/PlayerTalentsRoutes');
const talentsRoutes = require('./routes/TalentsRoutes');
const statsRoutes = require('./routes/StatsRoutes');
const combatSessionRoutes = require('./routes/CombatSessionRoutes');
const combatantRoutes = require('./routes/CombatantRoutes');
const mobRoutes = require('./routes/MobRoutes');

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use("/player", playerRoutes);
app.use("/item", itemRoutes);
app.use("/weapon", weaponRoutes);
app.use("/playertalents", playertalentsRoutes);
app.use("/talents", talentsRoutes);
app.use("/stats", statsRoutes);
app.use("/combatSession", combatSessionRoutes);
app.use("/combatant", combatantRoutes);
app.use("/mob", mobRoutes);


const server = app.listen(port, () => {
    AppDataSource.initialize().then(async () => {
        const initDuration = Date.now() - startTime;
        console.log(`[Server]: Server is running at http://localhost:${port}`);
        console.log(`[Initialization]: Application and database initialized in ${formatDuration(initDuration)}`);
        if(AppDataSource.options.synchronize) {
            console.log(`[Database]: Database synchronizing is enabled`);
        }
        if (process.env.SEED_DB === "true") {
            console.log(`[Database Seeding]: Starting to seed talents`)
            await seedTalents();
            console.log(`[Database Seeding]: Finished seeding talents`)
        }
        server.emit("appStarted");
    }).catch(error => console.log(error));
});

const seedTalents = async () => {
    const data = fs.readFileSync(path.join(__dirname, 'talents.json'), 'utf8');
    const talentsData = JSON.parse(data);
    const talentRepository = AppDataSource.getRepository(Talents);

    const existingCount = await talentRepository.count();
    if (existingCount > 0) {
      console.log(`[Database Seeding]: Skipping seeding for Talents, table already contains data`);
      return;
    }
  
    for (const talentData of talentsData) {
        var talent = talentRepository.create(talentData);
        await talentRepository.save(talent);
    }
};

const formatDuration = (ms: any) => {
    if (ms < 60000) return `${(ms / 1000).toFixed(2)} seconds`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(2);
    return `${minutes} minutes and ${seconds} seconds`;
};

module.exports = server;
