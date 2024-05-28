# Mobilna aplikacija za upravljanje ličnim finansijama / budžetiranje

Aplikacija je hibridnog tipa kreirana pomoću tehnologija: Angular + Ionic i Firebase (Realtime Database i Authentication).
Aplikacija je zasnovana na radu sa dva glavna entiteta:

- **Koverte**: služe za definisanje mesečnih/godišnjih (Monthly/Annual) budžeta kategorija ili novčanih ciljeva (Goal) kategorija.
- **Transakcije**: služe za dodavanje troškova (Expense) i primanja (Income) ili za prebacivanje iznosa iz koverte sa neraspoređenim novcem u druge koverte (Fill from available).

## Funkcionalnosti

- **Autentifikacija**: korisnici se mogu registrovati, prijaviti i odjaviti sa aplikacije.
- **Dodavanje koverti**: korisnici mogu dodavati nove koverte i definisati njihovu kategoriju, tip i iznose budžeta, odnosno cilja u zavisnosti od izabranog tipa.
- **Izmena koverti**: korisnici mogu ažurirati postojeće koverte.
- **Brisanje koverti**: korisnici mogu brisati koverte.
- **Pregled koverti**: korisnici mogu pregledati sve definisane koverte ili klikom na određenu kovertu dodatne detalje i sve transakcije vezane za kovertu.
- **Dodavanje Transakcija**: korisnici mogu dodavati nove transakcije i definisati njihov tip, stranu kojoj se plaća / koja je uplatila iznos, iznos, alokaciju iznosa po kovertama, datum i belešku.
- **Izmena Transakcija**: korisnici mogu ažurirati postojeće transakcije.
- **Brisanje Transakcija**: korisnici mogu brisati transakcije.
- **Pregled Transakcija**: korisnici mogu pregledati listu svih svojih transakcija ili klikom na određenu transakciju dodatne detalje.
- **Pregled mesečnih izveštaja**: korisnici mogu za određeni mesec u godini pogledati odnos troškova i primanja.

## Preduslovi

- [Node.js](https://nodejs.org/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Angular CLI](https://angular.io/cli)
- [Ionic CLI](https://ionicframework.com/docs/intro/cli)
- [Firebase Nalog](https://firebase.google.com/)

## Instalacija

1. Klonirajte repozitorijum i pozicionirajte se u novi direktorijum:
   ```sh
   git clone https://github.com/st-filip/budget-mobile-app.git
   cd budget-mobile-app
   ```
2. Instalirajte zavisnosti (node_modules):
   ```sh
   npm install
   ```
3. Podesite Firebase:
   - Kreirajte novi projekat u Firebase Console.
   - Omogućite Firebase Realtime Database i Authentication.
   - Dodajte konfiguraciju u src/environments/environment.ts:
     ```ts
     export const environment = {
       production: false,
       firebaseApiKey: "Your API key",
       firebaseDatabaseUrl: "Your Firebase Database URL",
     };
     ```
4. Pokrenite server:
   ```sh
   ng serve
   ```
   ili
   ```sh
   ionic serve
   ```
