import React from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { MainScene } from "./scenes/main";

const App = React.memo(({ controller }) => {
  return <IonPhaser game={{
      width: 800,
      height: 800,
      type: Phaser.AUTO,
      scene: MainScene,
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },

      callbacks: {
        preBoot: (game) => {
          // inject Colyseus controller into scene
          // used for communication b/w backend
          game.registry.merge({ controller });
        }
      }
    }
  }/>;
});

export default App;
