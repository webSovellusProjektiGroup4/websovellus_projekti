# ELOKUVAPALVELU
# Vaatimusmäärittely

**Versio:** 0.1 · 29.10.2026  
**Perusta:** Asiakastapaamisen 1 pohjalta laadittu luonnos

**Dokumentin tila:** alustava. Vaatimukset perustuvat asiakkaan haastattelumuistiinpanoihin. Merkintä *Vahvistettava* tarkoittaa, että yksityiskohta tai toteutusrajaus pitää vielä hyväksyttää asiakkaalla.

## 1. Projektin tavoite ja tausta

Rakennetaan suomenkielinen, mobiilissa ja tietokoneella toimiva verkkopalvelu elokuvaharrastajille.

Palvelussa voi etsiä elokuvia, tutustua niiden tietoihin, antaa arvioita, tehdä omia elokuvalistoja sekä jakaa suosituksia ystävien ja elokuvaryhmien kesken. Palvelu ei toista kokonaisia elokuvia.

**Keskeinen käyttäjäarvo:** tuttujen ihmisten suositukset ovat henkilökohtaisesti merkityksellisempiä kuin tuntemattomien arvostelut. Ryhmät ja niissä jaetut elokuvat ovat siten palvelun keskiössä.

## 2. Käyttäjäroolit

| Rooli | Oikeudet / käyttötarkoitus |
|---|---|
| Vierailija | Selata elokuvia ja julkisia ryhmiä, lukea julkisia arvosteluja sekä avata jaettuja listoja. |
| Rekisteröitynyt käyttäjä | Kirjautua, arvostella, kommentoida, tehdä listoja, perustaa ryhmiä sekä osallistua ryhmiin. |
| Ryhmän ylläpitäjä | Hallita ryhmän liittymistä, jäseniä ja muita ylläpitäjiä. Samassa ryhmässä voi olla useita ylläpitäjiä. |
| Palvelun pääkäyttäjä | Hallinnoida sivustoa kokonaisuutena. Tarkat moderointi- ja hallintatoiminnot vahvistettava. |

## 3. Toiminnalliset vaatimukset (FR)

Prioriteetit: **P1** = ensimmäiseen versioon ehdotettu ydintoiminto; **P2** = tärkeä, mutta toteutus voidaan sopia myöhemmäksi; **P3** = jatkokehitysidea. Prioriteetit ovat projektiryhmän ehdotus, eivät asiakkaan hyväksymä päätös.

| ID | Pri. | Vaatimus | Kuvaus |
|---|---|---|---|
| FR-01 | P1 | Selaaminen ilman tunnusta | Vierailija voi avata palvelun ja selata elokuvia ilman rekisteröitymistä. |
| FR-02 | P1 | Etusivu | Etusivulla näkyy ajankohtaisia ja kiinnostavia elokuvia sekä hakumahdollisuus. |
| FR-03 | P1 | Elokuvahaku | Elokuvia voi hakea nimellä ja näyttelijän nimellä. |
| FR-04 | P1 | Elokuvan tiedot | Näytetään vähintään nimi, juliste, kuvaus, julkaisuvuosi, näyttelijät ja traileri, mikäli saatavilla. |
| FR-05 | P1 | Elokuvatietojen rajapinta | Elokuvien faktatiedot haetaan TMDB-rajapinnasta; omia arvostelutietoja ei tallenneta TMDB:hen. |
| FR-06 | P1 | Rekisteröityminen ja kirjautuminen | Käyttäjä luo tunnuksen itse valitsemallaan käyttäjänimellä ja kirjautuu salasanalla. |
| FR-07 | P1 | Tähtiarvio | Kirjautunut käyttäjä voi arvioida elokuvan 1–5 tähdellä ilman tekstikommenttia. |
| FR-08 | P1 | Tekstiarvostelu | Kirjautunut käyttäjä voi kirjoittaa arvostelun ja muokata omaa tekstiään; erillistä asiakkaan vaatimaa maksimipituutta ei ole. |
| FR-09 | P1 | Arvioiden näyttö | Sallitut arviot näkyvät kirjoittajan käyttäjänimellä ja annetuilla tähdillä. |
| FR-10 | P1 | Arvion näkyvyys | Arvostelun kirjoittaja voi määritellä arvostelunsa julkiseksi tai yksityiseksi. Yksityisyyden tarkka merkitys vahvistettava. |
| FR-11 | P2 | Useampi arvio samasta elokuvasta | Sama käyttäjä voi arvioida saman elokuvan useammin kuin kerran; näyttötapa ja keskiarvolaskenta vahvistettava. |
| FR-12 | P1 | Ryhmän perustaminen | Kirjautunut käyttäjä voi perustaa ryhmän antamalla sille nimen. |
| FR-13 | P1 | Ryhmän näkyvyys | Julkinen ryhmä löytyy selaamalla. Yksityinen ryhmä ei näy ulkopuolisille. |
| FR-14 | P1 | Ryhmään liittyminen ja kutsut | Ryhmiin voi kutsua käyttäjiä; ylläpitäjä voi hallita jäsenyyden hyväksymistä. |
| FR-15 | P1 | Ryhmän jäsenhallinta | Jäsen voi poistua ryhmästä; ylläpitäjä voi poistaa jäsenen; ryhmässä voi olla useita ylläpitäjiä. |
| FR-16 | P1 | Elokuvan jakaminen ryhmään | Ryhmän jäsenet voivat julkaista elokuvan ryhmän sivulle ja arvioida jaettuja elokuvia. |
| FR-17 | P2 | Ryhmän keskustelut | Elokuvia voi kommentoida; erillisen ryhmäkeskustelun laajuus vahvistettava. |
| FR-18 | P1 | Henkilökohtaiset listat | Käyttäjä voi luoda, nimetä ja täydentää elokuvalistojaan. |
| FR-19 | P1 | Listojen jakaminen | Käyttäjä voi jakaa listan linkillä esimerkiksi WhatsAppiin; vastaanottajalta ei edellytetä tunnusta. |
| FR-20 | P2 | Palvelun ylläpito | Erillinen admin-rooli hallinnoi palvelua; tarkat toiminnot täsmennettävä. |
| FR-21 | P3 | Suosittelut | Elokuvasuosituksia tarjotaan katselu- ja arvostelumieltymysten perusteella, mahdollisesti tekoälyllä. |
| FR-22 | P3 | Näytösajat | Näytetään paikallisten elokuvateatterien näytösajat, mikäli sopiva tietolähde on saatavilla. |
| FR-23 | P3 | Tilastot | Näytetään esimerkiksi suosituimmat ja eniten arvostellut elokuvat. |
| FR-24 | P3 | Maksullisuus | Mahdollistetaan myöhemmin maksulliset elokuvakerhot tai organisaatioiden ryhmät. |

## 4. Ei-toiminnalliset vaatimukset (NFR)

| ID | Laatuvaatimus | Määrittely | Todentaminen |
|---|---|---|---|
| NFR-01 | Responsiivisuus | Kaikki keskeiset näkymät toimivat puhelimella ja tietokoneella. | Testataan vähintään kapealla mobiilinäkymällä ja työpöytäselaimella. |
| NFR-02 | Ulkoasun laatu | Palvelun ulkoasu on moderni, selkeä ja ammattimainen. | Yhteinen käyttöliittymäsuunnitelma ja asiakkaan hyväksymä katselmointi. |
| NFR-03 | Kieli | Ensimmäinen versio toimii suomeksi; laajentaminen englantiin ja ruotsiin on mahdollista. | Käyttöliittymän keskeiset tekstit suomeksi; kielilaajennus huomioidaan rakenteessa. |
| NFR-04 | Tietoturva | Salasanoja ei tallenneta selväkielisinä, ja palvelin tarkistaa käyttöoikeudet. | Testit kirjautumiseen, yksityisten sisältöjen näkyvyyteen ja ryhmäoikeuksiin. |
| NFR-05 | Tietosuoja | Yksityiset arviot, ryhmät ja käyttäjätiedot eivät vuoda sivullisille. | Varmistetaan käyttöoikeustestauksella sekä suunnittelemalla tietojen käsittely. |
| NFR-06 | Toimintavarmuus | Puuttuvat TMDB-tiedot, trailerit tai rajapintavirheet eivät kaada sovellusta. | Testataan rajapinnan virhe- ja tyhjän tuloksen tilanteet. |
| NFR-07 | Käytettävyys | Elokuvahaku, arvostelu, listan teko ja ryhmän perustaminen ovat yksinkertaisia. | Käyttäjätestit sovituilla pääpoluilla. |
| NFR-08 | Ylläpidettävyys | Sovelluksen koodi ja tietokantarakenne ovat selkeitä ja dokumentoituja. | Projektiryhmän koodikatselmointi ja asennusohjeet. |

## 5. Keskeiset käyttötapaukset

| ID | Käyttäjän tavoite | Odotettu lopputulos |
|---|---|---|
| UC-01 | Vierailija hakee elokuvan nimellä. | Hakutulokset ja elokuvan tarkemmat tiedot avautuvat ilman kirjautumista. |
| UC-02 | Käyttäjä antaa elokuvalle 4 tähteä. | Arvio tallentuu ja näkyy valitun näkyvyysasetuksen mukaisesti. |
| UC-03 | Käyttäjä luo yksityisen ryhmän ja kutsuu ystävän. | Ryhmää ei löydy julkisella haulla; kutsuttu voi liittyä sovitulla tavalla. |
| UC-04 | Ryhmän jäsen jakaa elokuvan ja muut arvioivat. | Elokuva näkyy ryhmässä ja ryhmän jäsenet näkevät sallitut arviot. |
| UC-05 | Käyttäjä jakaa katselulistan WhatsApp-linkillä. | Linkin vastaanottaja näkee jaettavan listan ilman kirjautumista. |

## 6. Alustava tietomalli ja integraatiot

Keskeiset omat tietokohteet: käyttäjä, ryhmä, ryhmäjäsenyys ja ylläpitäjärooli, elokuvaan viittaava TMDB-tunniste, arvio, kommentti sekä käyttäjän lista ja listan elokuvajäsenyys. Kutsujen ja jakolinkkien tekninen tallennustapa ratkaistaan suunnitteluvaiheessa.

**Ulkoinen integraatio:** TMDB tarjoaa elokuvien perustiedot ja mahdollisesti kuvat sekä traileritiedot. Näytösaikoihin tarvitaan todennäköisesti erillinen, tarkistettava tietolähde. TMDB:n käyttöehdot, kuvalisenssit, käyttörajat ja mahdolliset attribuutiovaatimukset tarkistetaan ennen julkaisua.

## 7. Toteutuksen ehdotettu rajaus

**Ensimmäinen versio (MVP):** FR-01–FR-10 (poikkeuksena FR-11), FR-12–FR-16, FR-18–FR-19 sekä sovittu perusylläpito. Kaikki NFR-vaatimukset soveltuvin osin. Arvostelujen yksityisyydestä ja ryhmien käyttöoikeuksista täytyy sopia ennen toteutusta.

**Myöhempään vaiheeseen:** moninkertaiset arvosteluhistoriat, laajat keskustelutoiminnot, edistyneet ylläpitonäkymät, tekoälysuosittelut, näytösajat, tilastot ja maksulliset ominaisuudet. Rajaus hyväksytetään asiakkaalla.

## 8. Avoimet kysymykset ja oletukset

| Tunnus | Avoin kysymys / päätös |
|---|---|
| A-01 | Näkeekö yksityisen arvostelun vain kirjoittaja vai myös valitut ryhmät? |
| A-02 | Tallentuvatko saman elokuvan kaikki arviokerrat vai korvataanko aiempi? Miten keskiarvo lasketaan? |
| A-03 | Voiko julkiseen ryhmään liittyä heti vai vaatiiko liittyminen hyväksynnän? |
| A-04 | Miten kutsut toteutetaan: käyttäjänimellä, linkillä vai muulla tavalla? |
| A-05 | Onko kommentointi elokuvakohtaista vai tarvitaanko erillinen ryhmäkeskustelu? |
| A-06 | Miten ryhmäylläpitäjät nimetään, ja miten ryhmän omistajuus siirretään? |
| A-07 | Voidaanko listat pitää yksityisinä tai jakaa vain linkillä? |
| A-08 | Mitä pääkäyttäjä voi tehdä: poistaa sisältöä, estää käyttäjiä, hallinnoida ryhmiä? |
| A-09 | Miten käyttäjän tunnuksen palautus, tilin poisto ja henkilötietojen käsittely toteutetaan? |
| A-10 | Mitkä P1-ominaisuudet asiakas hyväksyy projektin todelliseen MVP-laajuuteen? |

## 9. Hyväksymiskriteerit ja eteneminen

Valmistumista voidaan arvioida pääkäyttöpolkujen kautta: vierailija löytää elokuvan; kirjautunut käyttäjä arvioi elokuvan; yksityisen ryhmän tiedot pysyvät vain oikeutettujen nähtävillä; jäsen hallitsee ryhmään osallistumistaan; käyttäjä jakaa elokuvalistan ilman kirjautumispakkoa vastaanottajalle. Lisäksi sovellus testataan mobiilissa ja työpöydällä.

**Seuraava vaihe:** käydään avoimet kysymykset läpi asiakkaan kanssa, hyväksytään MVP:n prioriteetit ja muutetaan hyväksytyt vaatimukset toteutustehtäviksi (esim. backlogiin).
