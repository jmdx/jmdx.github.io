-- Read more about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/effects/time.html

import Html exposing (..)
import Html.Attributes exposing (..)
import Time exposing (Time, second)
import Keyboard
import Random

main =
  Html.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

-- MODEL
type EntityType
  = Player | Enemy | Goal
type Direction = Up | Down | Left | Right | Neutral

type alias Row = Int
type alias Col = Int

type alias Entity = (EntityType, Row, Col)

type GameState = Start | InProgress | GameOver

type alias Game =
  { player : Entity
  , enemy : Entity
  , goal : Entity
  , nRows : Int
  , nCols : Int
  , playerDirection : Direction
  , score : Int
  , state : GameState
  }

type alias Model = (Time, Game)

init : (Model, Cmd Msg)
init =
  ( ( 0
    , { player = (Player, 0, 0)
      , enemy = (Enemy, 4, 6)
      , goal = (Goal, 4, 4)
      , nRows = 5
      , nCols = 7
      , playerDirection = Right
      , score = 0
      , state = Start
      }
    )
  , Cmd.none
  )

-- UPDATE
type Msg
  = Tick Time
  | KeyMsg Keyboard.KeyCode

type alias Movement = (Int, Int)

playerMovement: Direction -> Movement
playerMovement direction = case direction of
  Up ->
    (-1, 0)
  Down ->
    (1, 0)
  Left ->
    (0, -1)
  Right ->
    (0, 1)
  Neutral ->
    (0, 0)

trimDifference: Int -> Int -> Int
trimDifference current target = case compare current target of
  LT -> 1
  EQ -> 0
  GT -> -1

-- TODO probably parametrize these types, however that's done in elm
enemyMovement: Entity -> Entity -> Movement
enemyMovement (_, enemyRow, enemyCol) (_, playerRow, playerCol) =
  -- enemies get to move diagonally
  let
    dRow = trimDifference enemyRow playerRow
    dCol = trimDifference enemyCol playerCol
    movement = case (playerRow + playerCol) % 5 of
      -- Kind of a clumsy, slight randomization of enemy movement
      0 -> (dRow, 0)
      1 -> (0, dCol)
      _ -> (dRow, dCol)
  in
    movement

applyMovement: Entity -> Movement -> Game -> Entity
applyMovement (entityType, row, col) (dRow, dCol) game =
  (entityType, (row + dRow) % game.nRows, (col + dCol) % game.nCols)

move: Entity -> Game -> Entity
move entity game =
  let
    movement = case entity of
      (Player, _, _) ->
        playerMovement game.playerDirection
      (Enemy, _, _) ->
        enemyMovement game.enemy game.player
      (Goal, _, _) ->
        (2, 2)
  in
    applyMovement entity movement game

getDirection: Keyboard.KeyCode -> Direction
getDirection code = case code of
  37 -> Left
  38 -> Up
  39 -> Right
  40 -> Down
  _ -> Neutral

collides: Entity -> Entity -> Bool
collides (_, leftRow, leftCol) (_, rightRow, rightCol) =
  leftRow == rightRow && leftCol == rightCol


update : Msg -> Model -> (Model, Cmd Msg)
update msg (oldTime, game) =
  -- TODO the data here can probably be unpacked/repacked nicer
  case game.state of
    InProgress -> case msg of
      Tick newTime ->
        if collides game.enemy game.player then
          ( (newTime
          , { game | state = GameOver }
          ), Cmd.none)
        else if collides game.player game.goal then
          ( (newTime
          , { game
          | score = game.score + 1
          , goal = move game.goal game}
          ), Cmd.none)
        else
          let
            afterPlayerMoved = { game | player = move game.player game }
          in ( (newTime
          -- TODO remove afterPlayerMoved if we're not going to use it
          , { afterPlayerMoved | enemy = move game.enemy game}
          ), Cmd.none)
      KeyMsg code ->
        ( (oldTime
        , { game | playerDirection = getDirection code }
        ), Cmd.none)
    Start -> case msg of
      KeyMsg 32 ->
        ((oldTime, { game | state = InProgress }), Cmd.none)
      _ -> ((oldTime, game), Cmd.none)
    GameOver -> case msg of
      KeyMsg 32 ->
        let
          ((initTime, initModel), _) = init
        in
          ((initTime, {initModel | state = InProgress}), Cmd.none)
      _ -> ((oldTime, game), Cmd.none)



-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions (time, game) =
  Sub.batch
    [ Time.every ((second / 4) + (second / (toFloat game.score + 1))) Tick
    , Keyboard.downs KeyMsg
    ]

-- VIEW

percent =
  \a -> (toString a) ++ "%"

color: EntityType -> String
color entityType =
  case entityType of
    Player -> "blue"
    Enemy -> "red"
    Goal -> "yellow"

monospace = ("font-family", """
"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace
""")

renderDirection: Direction -> String
renderDirection direction = case direction of
  Up -> "^"
  Down -> "v"
  Left -> "<"
  Right -> ">"
  _ -> ""

renderEntity: Game -> Entity -> Html Msg
renderEntity game (entityType, row, col) =
  let
    colWidth = 100 / toFloat game.nCols
    rowHeight = 100 / toFloat game.nRows
    x = colWidth * toFloat col
    y = rowHeight * toFloat row
    content = case entityType of
      Player -> renderDirection game.playerDirection
      _ -> ""
  in
    div [ style
      [ ("background-color", color entityType)
      , monospace
      , ("font-size", "10vh")
      , ("padding-top", "3vh")
      , ("text-align", "center")
      , ("box-sizing", "border-box")
      , ("width", percent colWidth)
      , ("height", percent rowHeight)
      , ("left", percent x)
      , ("top", percent y)
      , ("opacity", "0.4")
      , ("position", "absolute")
      , ("outline", "5px solid black")
      ]
      ] [ text content ]

renderScore: Int -> Html Msg
renderScore score =
  div [ style
        [ ("z-index", "-1")
        , monospace
        , ("width", percent 100)
        , ("height", percent 100)
        , ("position", "absolute")
        , ("font-size", "50vw")
        , ("color", "#fff")
        , ("background-color", "#222")
        , ("text-align", "center")
        , ("line-height", "100vh")
        ]
        ] [ text (toString score) ]

wrapContent: List (Html Msg) -> Html Msg
wrapContent content =
  div [ style
        [ ("z-index", "-1")
        , monospace
        , ("width", percent 100)
        , ("height", percent 100)
        , ("position", "absolute")
        , ("font-size", "5vh")
        , ("color", "#fff")
        , ("background-color", "#222")
        , ("text-align", "center")
        , ("box-sizing", "border-box")
        , ("padding-top", "35vh")
        , ("line-height", "1")
        ]
        ] content

render: Game -> List (Html Msg)
render game =
  List.map (\entity -> renderEntity game entity)
    [ game.player, game.enemy, game.goal ]

colorSpan: String -> String -> String -> Html Msg
colorSpan content color fontSize =
  span
    [ style
      [ ("color", color)
      , monospace
      , ("font-size", fontSize)
      ]
    ] [ text content ]

italicDiv: String -> String -> String -> Html Msg
italicDiv content color fontSize =
  div
    [ style
      [ ("color", color)
      , monospace
      , ("font-size", fontSize)
      , ("font-style", "italic")
      ]
    ] [ text content ]

renderStart: Html Msg
renderStart =
  wrapContent
    [ colorSpan "35 Cells" "white" "5vh"
    , br [] []
    , colorSpan " You " "blue" "3vh"
    , colorSpan " Enemy " "red" "3vh"
    , colorSpan " Goal " "yellow" "3vh"
    , br [] []
    , colorSpan "Space to start" "white" "2vh"
    , br [] []
    , colorSpan "Arrow keys to move" "white" "2vh"
    , br [] []
    , colorSpan "---" "white" "2vh"
    , italicDiv "Once upon a time there lived a blue pixel named Plum." "white" "2vw"
    , italicDiv "He lived on a small screen in a faraway land." "white" "2vw"
    , italicDiv "He had heard of the legendary color, yellowblue." "white" "2vw"
    , italicDiv "Every night he dreamed of becoming yellowblue." "white" "2vw"
    , italicDiv "But no matter how many yellow pixels he consumed..." "white" "2vw"
    , italicDiv "it was never enough." "white" "2vw"
    , br [] []
    ]

renderGameOver: Int -> Html Msg
renderGameOver score =
  wrapContent
    [ colorSpan ("Score: " ++ toString score) "white" "5vh"
    , br [] []
    , colorSpan "Space to restart" "white" "2vh"
    ]

view : Model -> Html Msg
view (time, game) =
  case game.state of
    InProgress ->
      div [] (render game ++ [renderScore game.score])
    GameOver -> renderGameOver game.score
    Start -> renderStart
