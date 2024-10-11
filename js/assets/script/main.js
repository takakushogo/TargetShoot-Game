window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
function main(param) {
    g.game.pushScene(createTitleScene());
}


function createTitleScene()
{
    const scene = new g.Scene
    ({
        game: g.game,
        assetIds: ["target"]
    });
    scene.onLoad.add(function()
    {
        const group=new g.E({scene:scene});

        const titleFont = new g.DynamicFont
        ({
            game: g.game,
            fontFamily: g.FontFamily.SansSerif,
            size: 50
        });
        const titleLabel = new g.Label
        ({
            scene: scene,
            font: titleFont,
            text: "ターゲットを撃て!",
            fontSize: 50,
            textColor: "black",
            anchorX:0.5,
            x: g.game.width/2,
            y: g.game.height/2,
        });

        const buttonFont = new g.DynamicFont
        ({
            game: g.game,
            fontFamily: g.FontFamily.SansSerif,
            size: 30
        });
        const buttonLabel=new g.Label
        ({
            scene: scene,
            font: buttonFont,
            text: "Press Start",
            fontSize: 30,
            textColor: "black",
            anchorX:0.5,
            x: g.game.width/2,
            y: g.game.height/2+100
        });

        const akashicLabel = require("@akashic-extension/akashic-label");
        const ruleFont = new g.DynamicFont
        ({
            game: g.game,
            fontFamily: g.FontFamily.SansSerif,
            size: 15
        });
        const ruleLabel=new akashicLabel.Label
        ({
            scene: scene,
            font: ruleFont,
            text: "制限時間内に的をクリックしていくゲームです\r爆弾をクリックしたらゲームオーバー\r金色の的は取り逃してもOK",
            fontSize: 15,
            textColor: "black",
            anchorX:0.38,
            width:g.game.width,
            x: g.game.width/2+300,
            y: g.game.height/2+50
        });

        const targetImage = scene.asset.getImageById("target");
        const backImage=new g.Sprite
        ({
            scene: scene,
            src:targetImage,
            width: 500,
            height: 500,
            anchorX:0.5,
            anchorY:0.5,
            x:g.game.width/2,
            y:g.game.height/2,
            scaleX:2.5,
            scaleY:2.5
        });

        group.append(backImage);
        group.append(titleLabel);
        group.append(ruleLabel);
        group.append(buttonLabel);
        scene.append(group);
    });
    scene.onPointDownCapture.add(function()
    {
        g.game.replaceScene(createGameScene(0));
    });
    return scene;
}


function createGameScene(point)
{
	const scene = new g.Scene
    ({
        game: g.game,
        assetIds: ["bom","target","specialtarget"]
    });
	const group=new g.E({scene:scene});



    scene.onLoad.add(function ()
	{
        const bomImage = scene.asset.getImageById("bom");
        const targetImage = scene.asset.getImageById("target");
        const specialImage =scene.asset.getImageById("specialtarget");
        const tl=require("@akashic-extension/akashic-timeline");
        const timeLine=new tl.Timeline(scene);

		const font = new g.DynamicFont
		({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			size: 15
		});
		const label = new g.Label
		({
			scene: scene,
			font: font,
			text: `${point}`,
			fontSize: 15,
			textColor: "blue",
			x: g.game.width/2,
			y: g.game.height/2
		});


		let timeout;
		let specialPoint=0;
		const nowpoint=point;
		const random=Math.floor(g.game.random.generate()*10)+1;
		const targetcount=Math.floor(g.game.random.generate()*random);
        const specialCount=Math.floor(g.game.random.generate()*5);
		let time=0;
		if(random-targetcount==0) //バランス調整をするならここ
		{
			time=1000;
		}else
		{
			for(let i=0;i<targetcount;i++)
			{
				if(i>0)
				{
					time+=450;
				}else
				{
					time=1000;
				}
			}
		}
		for(let i=0;i<random-targetcount;i++)
		{
            const positionx=g.game.random.generate()*(g.game.width-50);
            const positiony=g.game.random.generate()*(g.game.height-50);
            const bom= new g.Sprite
            ({
                scene: scene,
                src: bomImage,
                width: 800,
                height: 800,
                scaleX:0.2,
                scaleY:0.2,
                x:Math.floor(positionx),
                y:Math.floor(positiony),
                touchable:true
            });

            bom.onPointDown.add(()=>
            {
                scene.clearTimeout(timeout);
                g.game.replaceScene(createGameOverScene(point+specialPoint));
            })
            group.append(bom);

            if(i==targetcount-1 && specialCount==0)
            {
                const specialTarget=new g.Sprite
                ({
                    scene: scene,
                    src:specialImage,
                    width: 500,
                    height: 500,
                    x:Math.floor(positionx)+60,
                    y:Math.floor(positiony)+85,
                    scaleX:0.05,
                    scaleY:0.05,
                    cssColor:"Yellow",
                    touchable:true
                });
                specialTarget.onPointDown.add(function ()
                {
                    specialPoint+=3;
                    label.text=`${point+specialPoint}`;
                    group.remove(specialTarget);
                    label.invalidate();
                });

                group.append(specialTarget);
            }
		}
		for(let i=0;i<targetcount;i++)
		{
            const target = new g.Sprite
			({
				scene: scene,
                src:targetImage,
				width: 500,
				height: 500,
				x:Math.floor(g.game.random.generate()*(g.game.width-50)),
				y:Math.floor(g.game.random.generate()*(g.game.height-50)),
                scaleX:0.1,
                scaleY:0.1,
				cssColor:"red",
				touchable:true
			});

			if(target.x-150>0 && target.y-150>0 && target.x+150<g.game.width && target.y+150<g.game.height)
			{
				if(Math.floor(g.game.random.generate()*5)==0)
				{
					let moveX=Math.floor(g.game.random.generate()*100)+50;
					let moveY=Math.floor(g.game.random.generate()*100)+50;
					let b= Math.floor(g.game.random.generate()*2);if(b==1){b=true}else{b=false}
					if(b)
					{
						timeLine.create(target).moveTo(target.x+moveX,target.y+moveY,1000);
						b=false;
					}else
					{
						timeLine.create(target).moveTo(target.x-moveX,target.y-moveY,1000);
						b=true
					}
					scene.setInterval(function()
					{
						if(b)
						{
							timeLine.create(target).moveTo(target.x+moveX,target.y+moveY,1000);//一定時間ごとに切り替わる+と-の値を掛けて使う settimeoutで入れ子構造にしても良い
							b=false;
						}else
						{
							timeLine.create(target).moveTo(target.x-moveX,target.y-moveY,1000);
							b=true
						}
					},1000+500);
				}
			}

			target.onPointDown.add(function ()
			{
				point+=1;
				label.text=`${point+specialPoint}`;
				group.remove(target);
				label.invalidate();
			});
			group.append(target);
		}

		const timeFont = new g.DynamicFont
		({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			size: 20
		});
		const timeLabel = new g.Label
		({
			scene: scene,
			font: timeFont,
			text: `${time/1000}`,
			fontSize: 20,
			textColor: "blue",
			x: 0,
			y: 0
		});
		scene.onUpdate.add(function()
		{
			time-=1/g.game.fps*1000;
			timeLabel.text=`${(time/1000).toFixed(2)}`;
			timeLabel.invalidate();
		});

		group.append(timeLabel);
		group.append(label);
		scene.append(group);
		timeout=scene.setTimeout(function()
		{
			if(point==(nowpoint+targetcount))
			{
				if(targetcount==0)
				{
					point+=1;
					label.text=`${point+specialPoint}`;
					label.invalidate();
				}
				g.game.replaceScene(createGameScene(point+specialPoint));
			}else
			{
				g.game.replaceScene(createGameOverScene(point+specialPoint));
			}
		},time);
    });
	return scene;
}


function createGameOverScene(point)
{
	const scene=new g.Scene
	({
        game: g.game,
    });

	scene.onLoad.add(function () {
		const font = new g.DynamicFont
		({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			size: 50
		});
		const label = new g.Label
		({
			scene: scene,
			font: font,
			text: "GAME OVER",
			fontSize: 50,
			textColor: "red",
			x: 1280/2,
			y: 720/2
		});

		const score = new g.Label
		({
			scene: scene,
			font: font,
			text: "スコア"+`${point}`,
			fontSize: 50,
			textColor: "blue",
			x: 1280/2+50,
			y: 720/2+50
		});
		scene.append(score);
		scene.append(label);

		scene.onPointDownCapture.add(function()
		{
			g.game.replaceScene(createGameScene(0));
		});
	})
	return scene;
}

module.exports = main;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}