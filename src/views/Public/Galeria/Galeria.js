import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Services from "./Services.js";
import { Button, ButtonGroup } from "reactstrap";
import { Gallery } from "react-grid-gallery";
import Lightbox from "react-image-lightbox-rotate-latest";

const Galeria = (props) => {
  const { lang } = props;

  const [kategoriak, setKategoriak] = useState([]);
  const [galeriak, setGaleriak] = useState([]);
  const [selectedKategoria, setSelectedkategoria] = useState(0);
  const [selectedGaleria, setSelectedGaleria] = useState([]);
  //   const [currentImage, setCurrentImage] = useState(null);
  const [index, setIndex] = useState(-1);

  const currentImage = selectedGaleria[index];
  const nextIndex = (index + 1) % selectedGaleria.length;
  const nextImage = selectedGaleria[nextIndex] || currentImage;
  const prevIndex =
    (index + selectedGaleria.length - 1) % selectedGaleria.length;
  const prevImage = selectedGaleria[prevIndex] || currentImage;

  const handleClick = (index) => setIndex(index);
  const handleClose = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  const getKategoriak = (callback) => {
    Services.listKategoriak((err, res) => {
      if (!err) {
        setKategoriak(res);
        if (callback) {
          callback();
        }
      }
    });
  };

  //   const setCurrentImg = () => {
  //     const images = selectedGaleria ? selectedGaleria.kepek : null;
  //     setCurrentImage(images)
  //   }

  const getGaleriak = (callback) => {
    Services.listGaleria((err, res) => {
      if (!err) {
        setGaleriak(res);
        if (callback) {
          callback(res);
        }
      }
    });
  };

  const toggleKategoriak = (katid) => {
    setSelectedkategoria(katid);
  };

  const toggleGaleria = () => {
    const selected = galeriak.find(
      (gal) => gal.kategoriaid === selectedKategoria
    );
    const kepek = selected
      ? selected.kepek.map((s) => {
          s.alt = s.filename;
          return s;
        })
      : [];
    setSelectedGaleria(kepek);
  };

  const setDefaultKategoria = (galok) => {
    let selected = 1;

    for (let i = 0; i < galok.length; i++) {
      console.log(galok[i]);
      if (galok[i].kepek && galok[i].kepek.length > 0) {
        selected = galok[i].kategoriaid;
        break;
      }
    }

    toggleKategoriak(selected);
  };

  const renderKategoriaButtons = () => {
    console.log(kategoriak);
    return (
      <div className="galeria_buttonsdiv">
        <ButtonGroup className="galeria_buttongroup">
          {kategoriak.length > 0 &&
            kategoriak.map((kategoria) => {
              return (
                <Button
                  type="button"
                  key={kategoria.id}
                  className={`galeria_kategoriabutton${
                    selectedKategoria === kategoria.id ? " active" : ""
                  }`}
                  onClick={() => toggleKategoriak(kategoria.id)}
                >
                  <a href="#" onClick={() => toggleKategoriak(kategoria.id)}>
                    {lang === "hu"
                      ? kategoria.magyarkategorianev
                      : kategoria.kategorianev}
                  </a>
                </Button>
              );
            })}
        </ButtonGroup>
      </div>
    );
  };

  const renderGaleria = () => {
    console.log(selectedGaleria);
    return (
      selectedGaleria &&
      selectedGaleria.length > 0 && (
        <React.Fragment>
          <Gallery
            images={selectedGaleria}
            onClick={handleClick}
            enableImageSelection={false}
          />
          {!!currentImage && (
            /* @ts-ignore */
            <Lightbox
              mainSrc={currentImage.src}
              // imageTitle={currentImage.caption}
              mainSrcThumbnail={currentImage.src}
              nextSrc={nextImage.src}
              nextSrcThumbnail={nextImage.src}
              prevSrc={prevImage.src}
              prevSrcThumbnail={prevImage.src}
              onCloseRequest={handleClose}
              onMovePrevRequest={handleMovePrev}
              onMoveNextRequest={handleMoveNext}
              animationDuration={200}
              //   toolbarButtons={[<button key='1' onClick={() => alert('JBKJJBJKB')}>+</button>]}
            />
          )}
        </React.Fragment>
      )
    );
  };

  useEffect(() => {
    getKategoriak(() => getGaleriak((galok) => setDefaultKategoria(galok)));
  }, []);

  useEffect(() => {
    toggleGaleria();
  }, [selectedKategoria]);

  return (
    <div className="public_galeria">
      {renderKategoriaButtons()}
      {renderGaleria()}
    </div>
  );
};

Galeria.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Galeria;
