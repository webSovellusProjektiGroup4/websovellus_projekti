
//  Tämä on vaan mun apufuktion, joka muuttaa ryhmän näkyvyyden tekstin suomeksi.
//  Eli jos näkyvyys on public niin se palauttaa "Julkinen" ja jos private niin "Yksityinen".

function groupVisibilityText(visibility) {
  if (visibility === 'public') {
    return 'Julkinen'
  } else if (visibility === 'private') {
    return 'Yksityinen'
  } else {
    return visibility
  }
}

export default groupVisibilityText