import fs from 'fs';
class RuleRepository {
  constructor() {
  }
  async getAll(limit: number = 12, page: number = 1) {
    const path = `${__dirname}/rules.json`;
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  }
}

export default RuleRepository;