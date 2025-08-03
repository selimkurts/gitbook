'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20250803192050 extends Migration {

  async up() {
    this.addSql(`alter table "organization" add column "subdomain" varchar(255) not null, add column "custom_domain" varchar(255) null, add column "is_public" boolean not null default true;`);
    this.addSql(`alter table "organization" add constraint "organization_subdomain_unique" unique ("subdomain");`);
  }

  async down() {
    this.addSql(`alter table "organization" drop constraint "organization_subdomain_unique";`);
    this.addSql(`alter table "organization" drop column "subdomain", drop column "custom_domain", drop column "is_public";`);
  }

}
exports.Migration20250803192050 = Migration20250803192050;
