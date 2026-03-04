--# PLAYERS #--

DEFINE TABLE player SCHEMAFULL;

DEFINE FIELD name ON TABLE player TYPE string;
DEFINE FIELD identifier ON TABLE player TYPE string;
DEFINE FIELD last_played ON TABLE player TYPE datetime DEFAULT time::now();

DEFINE INDEX unique_player ON TABLE player COLUMNS identifier UNIQUE;

--# BANS #--

DEFINE TABLE ban SCHEMAFULL;

DEFINE FIELD player_id ON TABLE ban TYPE record<player>;
DEFINE FIELD reason ON TABLE ban TYPE string;
DEFINE FIELD expires ON TABLE ban TYPE datetime;
DEFINE FIELD issued_at ON TABLE ban TYPE datetime DEFAULT time::now();

DEFINE FIELD banned_by ON TABLE ban TYPE record<player>;

--# CHARACTERS #--

DEFINE TABLE character SCHEMAFULL;

DEFINE FIELD player_id ON TABLE character TYPE record<player>;
DEFINE FIELD information ON TABLE character TYPE object DEFAULT {};
DEFINE FIELD licenses ON TABLE character TYPE object DEFAULT {};
DEFINE FIELD organizations ON TABLE character TYPE object DEFAULT {};
DEFINE FIELD position ON TABLE character TYPE object DEFAULT {};
DEFINE FIELD inventory ON TABLE character TYPE object DEFAULT {};
DEFINE FIELD last_played ON TABLE character TYPE datetime DEFAULT time::now();

DEFINE INDEX unique_character ON TABLE character COLUMNS name UNIQUE;