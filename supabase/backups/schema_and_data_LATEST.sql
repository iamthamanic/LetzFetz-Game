


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."kv_store_c701770f" (
    "key" "text" NOT NULL,
    "value" "jsonb" NOT NULL
);


ALTER TABLE "public"."kv_store_c701770f" OWNER TO "postgres";


ALTER TABLE ONLY "public"."kv_store_c701770f"
    ADD CONSTRAINT "kv_store_c701770f_pkey" PRIMARY KEY ("key");



CREATE INDEX "kv_store_c701770f_key_idx" ON "public"."kv_store_c701770f" USING "btree" ("key" "text_pattern_ops");



CREATE INDEX "kv_store_c701770f_key_idx1" ON "public"."kv_store_c701770f" USING "btree" ("key" "text_pattern_ops");



CREATE INDEX "kv_store_c701770f_key_idx2" ON "public"."kv_store_c701770f" USING "btree" ("key" "text_pattern_ops");



CREATE INDEX "kv_store_c701770f_key_idx3" ON "public"."kv_store_c701770f" USING "btree" ("key" "text_pattern_ops");



CREATE INDEX "kv_store_c701770f_key_idx4" ON "public"."kv_store_c701770f" USING "btree" ("key" "text_pattern_ops");



CREATE INDEX "kv_store_c701770f_key_idx5" ON "public"."kv_store_c701770f" USING "btree" ("key" "text_pattern_ops");



CREATE INDEX "kv_store_c701770f_key_idx6" ON "public"."kv_store_c701770f" USING "btree" ("key" "text_pattern_ops");



CREATE INDEX "kv_store_c701770f_key_idx7" ON "public"."kv_store_c701770f" USING "btree" ("key" "text_pattern_ops");



CREATE INDEX "kv_store_c701770f_key_idx8" ON "public"."kv_store_c701770f" USING "btree" ("key" "text_pattern_ops");



ALTER TABLE "public"."kv_store_c701770f" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."kv_store_c701770f" TO "anon";
GRANT ALL ON TABLE "public"."kv_store_c701770f" TO "authenticated";
GRANT ALL ON TABLE "public"."kv_store_c701770f" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict VcdLlqrStLcd8wNzIP6fSo2YEit5EmRzMv9DmzaHN8oe35vEAxSkxiR7aQPkfOb

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: kv_store_c701770f; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."kv_store_c701770f" ("key", "value") VALUES
	('session:a4467b75-eb90-4a85-80c1-d7641b933aba', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a4467b75-eb90-4a85-80c1-d7641b933aba", "updated_at": "2025-11-30T15:33:54.054Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T15:33:52.363Z"}], "board_state_json": {"cards": []}}'),
	('session:ba89a4a1-ecdb-46e0-974c-7258b27b2040', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "ba89a4a1-ecdb-46e0-974c-7258b27b2040", "updated_at": "2025-11-30T10:42:49.500Z", "dice_history": [{"type": "W6", "value": 5, "timestamp": "2025-11-30T10:42:48.832Z"}, {"type": "W6", "value": 6, "timestamp": "2025-11-30T10:42:45.923Z"}, {"type": "W6", "value": 2, "timestamp": "2025-11-30T10:42:43.169Z"}], "board_state_json": {"cards": []}}'),
	('session:3da4291a-73d4-4a03-9f95-c47de29fa066', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "3da4291a-73d4-4a03-9f95-c47de29fa066", "updated_at": "2025-11-30T15:07:01.829Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('card:ec1f7c3d-403b-4d65-9d92-ccb44761d0fe', '{"id": "ec1f7c3d-403b-4d65-9d92-ccb44761d0fe", "name": "Licht-Arena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle Lichteffekte", "", "", ""], "element": "Light", "created_at": "2025-11-30T17:16:03.235Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 3}'),
	('session:0d230371-1eee-4f11-a5f0-e867b3c6c412', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "0d230371-1eee-4f11-a5f0-e867b3c6c412", "updated_at": "2025-12-02T09:34:36.266Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 102, "position": {"x": 12.521568812460004, "y": 133.58167491542815}}, {"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 104, "position": {"x": 786.8982378830425, "y": 146.01580612846357}}]}}'),
	('session:bc048857-c8a1-41da-af28-7553c77c34f3', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "bc048857-c8a1-41da-af28-7553c77c34f3", "updated_at": "2025-12-01T07:06:06.187Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 101, "position": {"x": 100.2, "y": 325.8}}]}}'),
	('session:486db22e-2a0b-481e-b626-1c0dcdb1c99a', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "486db22e-2a0b-481e-b626-1c0dcdb1c99a", "updated_at": "2025-11-30T18:33:28.181Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('card_index', '["abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "f689db8e-00a1-449f-bab0-6d6232c669e5", "729e994a-e460-4d80-80d0-7d489ddabba8", "0ce7298c-69e8-477a-b406-80d2b79ffca4", "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "c795eea1-185e-41aa-9db8-081cac770764", "7e12c8e7-e17a-422d-ae4e-551c52488517", "3e2238c1-8ea0-44c5-b933-2c5ee236fa13", "e29838a9-61d0-4769-8f21-70c158f431d7", "8290df8f-3eb0-4558-914f-da556bbd8f6e", "ec1f7c3d-403b-4d65-9d92-ccb44761d0fe", "50887f7b-b1b5-4f5d-bd8b-2c112bfc4885", "4ce4829d-3cff-4f04-a38e-aa7b2861a7ee", "06b4a916-93d8-4463-93ac-4a0990911b2e", "dfc56505-aecf-4376-8b79-19514925b4e0", "dd0e227c-432b-4008-8fb9-cab8bc12b6e2", "d6b89942-7884-4382-9ffd-66ab4828574e", "ee038d3a-da62-4f70-9c13-64d8599f8d1c"]'),
	('session:801f1b9b-bb75-4814-a5e2-849370e22eda', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "801f1b9b-bb75-4814-a5e2-849370e22eda", "updated_at": "2025-11-30T10:43:02.708Z", "dice_history": [{"biom": {"id": "7e12c8e7-e17a-422d-ae4e-551c52488517", "name": "Wasserarena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle wassereffekte", "", "", ""], "element": "Water", "created_at": "2025-11-29T00:07:50.457Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 2}, "mutation": {"id": "3e2238c1-8ea0-44c5-b933-2c5ee236fa13", "name": "von deiner Mama", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x w6 würfeln, wenn du unter 8 kommst, erleidest 2 Schaden", "", "", ""], "element": "Neutral", "created_at": "2025-11-29T00:14:22.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:15:29.859Z", "image_asset": "", "trigger_dice_value": 2}, "arenaName": "Wasserarena von der Mama", "timestamp": "2025-11-30T10:43:01.083Z"}], "board_state_json": {"cards": []}}'),
	('session:a206ccbf-f4ac-4caa-ae65-6548c35f2bda', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a206ccbf-f4ac-4caa-ae65-6548c35f2bda", "updated_at": "2025-11-30T15:07:18.868Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T15:07:17.273Z"}], "board_state_json": {"cards": []}}'),
	('card:50887f7b-b1b5-4f5d-bd8b-2c112bfc4885', '{"id": "50887f7b-b1b5-4f5d-bd8b-2c112bfc4885", "name": "Wind-Arena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle Windeffekte", "", "", ""], "element": "Neutral", "created_at": "2025-11-30T17:17:03.203Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 5}'),
	('session:0a0bacf5-2791-4d35-b5ef-3e16da0c8e81', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "0a0bacf5-2791-4d35-b5ef-3e16da0c8e81", "updated_at": "2025-11-30T18:34:07.411Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:e45f4e7c-c4b1-4407-af98-28b9b0833c2c', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "e45f4e7c-c4b1-4407-af98-28b9b0833c2c", "updated_at": "2025-12-01T07:06:38.936Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 102, "position": {"x": 62.80069341147217, "y": 225.7856697227306}}]}}'),
	('session:521099ba-bf83-4aac-b9cd-442171ec5991', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "521099ba-bf83-4aac-b9cd-442171ec5991", "updated_at": "2025-12-02T10:54:50.692Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('arena_index', '["fe75d74e-fb56-4dff-9a24-56745e5fced9", "135d7194-1027-4c49-9513-225cc7e9d102", "36ba72a3-dbbc-4f38-b418-14bb74165ac0", "e60d5193-4933-4d36-9dd3-77071e59e02b", "b61c9d1e-9d47-4b42-95e6-050d03336bca"]'),
	('session:c29a2dc5-c926-4914-acbe-e32ac94df9d6', '{"p1_hp": 20, "p2_hp": 20, "session_id": "c29a2dc5-c926-4914-acbe-e32ac94df9d6", "updated_at": "2025-11-28T22:16:08.889Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:d76a426c-3b2c-4403-8a9d-d26529be8b80', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "d76a426c-3b2c-4403-8a9d-d26529be8b80", "updated_at": "2025-11-30T18:35:19.152Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:e7681217-b9d6-4af3-a5df-d98117245e73', '{"p1_hp": 20, "p2_hp": 20, "session_id": "e7681217-b9d6-4af3-a5df-d98117245e73", "updated_at": "2025-11-28T22:41:44.716Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 1, "position": {"x": 5, "y": 293}}, {"cardId": "f689db8e-00a1-449f-bab0-6d6232c669e5", "zIndex": 2, "position": {"x": 320, "y": 195}}]}}'),
	('session:e67a0e27-a850-48d1-bb08-58eb45fb5365', '{"p1_hp": 20, "p2_hp": 20, "session_id": "e67a0e27-a850-48d1-bb08-58eb45fb5365", "updated_at": "2025-11-28T22:16:32.341Z", "dice_history": [{"type": "W20", "value": 13, "timestamp": "2025-11-28T22:16:31.931Z"}, {"type": "W20", "value": 5, "timestamp": "2025-11-28T22:16:29.287Z"}, {"type": "W12", "value": 5, "timestamp": "2025-11-28T22:16:26.713Z"}, {"type": "W6", "value": 5, "timestamp": "2025-11-28T22:16:24.368Z"}], "board_state_json": {"cards": []}}'),
	('session:27a3771c-6eb3-4b57-be30-cdc59cab91f6', '{"p1_hp": 20, "p2_hp": 20, "session_id": "27a3771c-6eb3-4b57-be30-cdc59cab91f6", "updated_at": "2025-11-28T22:17:36.726Z", "dice_history": [{"biom": null, "dice1": 3, "dice2": 2, "mutation": null, "timestamp": "2025-11-28T22:17:30.552Z"}], "board_state_json": {"cards": []}}'),
	('session:c606aad7-7b37-485f-958c-a6334d9f5cd5', '{"p1_hp": 20, "p2_hp": 20, "session_id": "c606aad7-7b37-485f-958c-a6334d9f5cd5", "updated_at": "2025-11-28T22:21:12.968Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:c00efbdc-8c6a-4366-98eb-59546bfae4b3', '{"p1_hp": 20, "p2_hp": 20, "session_id": "c00efbdc-8c6a-4366-98eb-59546bfae4b3", "updated_at": "2025-11-28T22:21:41.850Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:143d94dc-ad11-49a6-bcc8-c51c68b2f53b', '{"p1_hp": 20, "p2_hp": 20, "session_id": "143d94dc-ad11-49a6-bcc8-c51c68b2f53b", "updated_at": "2025-11-28T22:27:11.339Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:daf227a9-43c4-453f-bea2-050362c2c2ba', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "daf227a9-43c4-453f-bea2-050362c2c2ba", "updated_at": "2025-11-30T15:10:18.981Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:9d9b1da5-aa5b-4a93-bc8c-df0636095de3', '{"p1_hp": 20, "p2_hp": 20, "session_id": "9d9b1da5-aa5b-4a93-bc8c-df0636095de3", "updated_at": "2025-11-28T22:41:59.447Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('note:d0d41193-d136-4109-b552-53fe3662a497', '{"id": "d0d41193-d136-4109-b552-53fe3662a497", "title": "6 base charaktere", "content": "die sollen jeweils 4 effekte haben. aber haben kein element", "comments": [], "created_at": "2025-11-28T22:27:58.700Z", "updated_at": "2025-11-28T22:27:58.700Z"}'),
	('session:0a340a5d-6274-4399-a76c-4cb32461e5c3', '{"p1_hp": 20, "p2_hp": 20, "session_id": "0a340a5d-6274-4399-a76c-4cb32461e5c3", "updated_at": "2025-11-28T22:52:17.026Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('note_index', '["d0d41193-d136-4109-b552-53fe3662a497"]'),
	('session:0b630d6e-60f5-473e-b9c0-55e4ec8164b0', '{"p1_hp": 20, "p2_hp": 20, "session_id": "0b630d6e-60f5-473e-b9c0-55e4ec8164b0", "updated_at": "2025-11-28T22:30:46.373Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('arena:fe75d74e-fb56-4dff-9a24-56745e5fced9', '{"id": "fe75d74e-fb56-4dff-9a24-56745e5fced9", "name": "Feuerarena der Schmerzen", "created_at": "2025-11-28T22:40:09.359Z", "biom_card_id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "mutation_card_id": "729e994a-e460-4d80-80d0-7d489ddabba8"}'),
	('session:b819517e-a287-4aba-89fb-fc0680b77154', '{"p1_hp": 20, "p2_hp": 20, "session_id": "b819517e-a287-4aba-89fb-fc0680b77154", "updated_at": "2025-11-28T22:52:53.699Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:9579a237-a562-453e-bfd1-5206388375c8', '{"p1_hp": 20, "p2_hp": 20, "session_id": "9579a237-a562-453e-bfd1-5206388375c8", "updated_at": "2025-11-28T22:45:45.268Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:ddc9ff63-2c98-4470-be51-8f21cd09b099', '{"p1_hp": 20, "p2_hp": 20, "session_id": "ddc9ff63-2c98-4470-be51-8f21cd09b099", "updated_at": "2025-11-28T22:47:42.477Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:db5157b5-ccfb-40da-b885-40f50d1bb390', '{"p1_hp": 20, "p2_hp": 20, "session_id": "db5157b5-ccfb-40da-b885-40f50d1bb390", "updated_at": "2025-11-28T22:49:46.824Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "f689db8e-00a1-449f-bab0-6d6232c669e5", "zIndex": 1, "position": {"x": 91, "y": 172}}, {"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 616, "y": 98}}]}}'),
	('session:6f6cbcf4-62bf-4451-90f2-17b633b57393', '{"p1_hp": 20, "p2_hp": 20, "session_id": "6f6cbcf4-62bf-4451-90f2-17b633b57393", "updated_at": "2025-11-28T22:52:31.297Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:cce9808a-415b-4530-bcdd-8e952528d161', '{"p1_hp": 20, "p2_hp": 20, "session_id": "cce9808a-415b-4530-bcdd-8e952528d161", "updated_at": "2025-11-28T22:52:59.253Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:ce1a8f8e-ef9e-40ec-9159-02aeac27d546', '{"p1_hp": 20, "p2_hp": 20, "session_id": "ce1a8f8e-ef9e-40ec-9159-02aeac27d546", "updated_at": "2025-11-28T22:53:21.934Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:76fce32e-9283-4d31-bf21-f0687fd97762', '{"p1_hp": 20, "p2_hp": 20, "session_id": "76fce32e-9283-4d31-bf21-f0687fd97762", "updated_at": "2025-11-28T22:55:31.045Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 1, "position": {"x": 44, "y": 194}}]}}'),
	('session:33b9aa86-612f-418c-bfa1-88e60e84fc46', '{"p1_hp": 20, "p2_hp": 20, "session_id": "33b9aa86-612f-418c-bfa1-88e60e84fc46", "updated_at": "2025-11-28T22:55:57.476Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 1, "position": {"x": 70, "y": 151}}]}}'),
	('session:600142ea-c475-46e2-8cba-a7f0906bcb0c', '{"p1_hp": 20, "p2_hp": 20, "session_id": "600142ea-c475-46e2-8cba-a7f0906bcb0c", "updated_at": "2025-11-28T22:57:28.301Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 1, "position": {"x": -25, "y": 112}}]}}'),
	('card:4ce4829d-3cff-4f04-a38e-aa7b2861a7ee', '{"id": "4ce4829d-3cff-4f04-a38e-aa7b2861a7ee", "name": "Erd-Arena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle Erdeffekte", "", "", ""], "element": "Earth", "created_at": "2025-11-30T17:17:39.789Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 6}'),
	('card:abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd', '{"id": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "name": "Knuspergnom", "type": "Character_Base", "effects": ["+1 auf nahkampf wenn er unter 15 leben fällt", "kann bei einer 1 nochmal würfeln"], "element": "Neutral", "created_at": "2025-11-28T22:32:13.036Z", "stats_json": {}, "updated_at": "2025-11-28T23:18:42.495Z", "image_asset": "https://tprhkqoiomnojudkwyut.supabase.co/storage/v1/object/sign/make-c701770f-card-images/31d4f911-afe9-4692-87ac-e705dc270c52.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzg2ZDE0YS0wNjlkLTRlNGItYTNiZC04YzIwYzc4YTE4NmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYWtlLWM3MDE3NzBmLWNhcmQtaW1hZ2VzLzMxZDRmOTExLWFmZTktNDY5Mi04N2FjLWU3MDVkYzI3MGM1Mi5wbmciLCJpYXQiOjE3NjQzNzEyMzEsImV4cCI6MjA3OTczMTIzMX0.7k7oLqjNAtFPZamSdSc4_o3tZhAtFhKL0lbXK7eBTyg"}'),
	('session:cc2912d9-36a4-4058-8006-6129580d15ed', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "cc2912d9-36a4-4058-8006-6129580d15ed", "updated_at": "2025-11-29T17:41:46.908Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 9, "position": {"x": 33.45313243959754, "y": 299.7578224451373}}]}}'),
	('session:cfaba2b7-a6e0-4a92-9d65-bf20191badf1', '{"p1_hp": 20, "p2_hp": 20, "session_id": "cfaba2b7-a6e0-4a92-9d65-bf20191badf1", "updated_at": "2025-11-28T23:05:54.193Z", "dice_history": [{"type": "W20", "value": 10, "timestamp": "2025-11-28T23:05:53.876Z"}, {"type": "W20", "value": 20, "timestamp": "2025-11-28T23:05:52.238Z"}, {"type": "W20", "value": 12, "timestamp": "2025-11-28T23:05:50.529Z"}, {"type": "W20", "value": 19, "timestamp": "2025-11-28T23:05:48.686Z"}, {"type": "W12", "value": 7, "timestamp": "2025-11-28T23:05:46.709Z"}, {"type": "W6", "value": 2, "timestamp": "2025-11-28T23:05:43.845Z"}], "board_state_json": {"cards": []}}'),
	('session:87b2e74a-3d44-476e-a950-a1209af1852c', '{"p1_hp": 20, "p2_hp": 20, "session_id": "87b2e74a-3d44-476e-a950-a1209af1852c", "updated_at": "2025-11-28T23:06:29.281Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:b9e6dc8b-c0a8-484a-96e3-177dfa6f2350', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "b9e6dc8b-c0a8-484a-96e3-177dfa6f2350", "updated_at": "2025-11-29T00:31:13.152Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 6, "position": {"x": 20.243699651276387, "y": 250.0364430370246}}, {"cardId": "c795eea1-185e-41aa-9db8-081cac770764", "zIndex": 7, "position": {"x": 254.39261822376153, "y": 243.12227876952568}}]}}'),
	('session:49053ec1-115a-4276-82d8-69103175643b', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "49053ec1-115a-4276-82d8-69103175643b", "updated_at": "2025-11-29T00:19:44.732Z", "dice_history": [{"type": "W4", "value": 4, "timestamp": "2025-11-29T00:19:44.108Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 4, "position": {"x": 41.1953125, "y": 307.796875}}, {"cardId": "c795eea1-185e-41aa-9db8-081cac770764", "zIndex": 5, "position": {"x": 67.2, "y": 56.80000000000001}}]}}'),
	('session:d4b1c8b7-55a7-42cf-8c53-1029e1ed3411', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "d4b1c8b7-55a7-42cf-8c53-1029e1ed3411", "updated_at": "2025-11-29T15:50:46.759Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 1, "position": {"x": 140.2, "y": 285.8}}, {"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 5, "position": {"x": 624.1953125, "y": 347.796875}}]}}'),
	('session:3567c94d-876e-4b83-abb6-6ae251b5d668', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "3567c94d-876e-4b83-abb6-6ae251b5d668", "updated_at": "2025-11-29T17:50:59.887Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 154.1953125, "y": 220.796875}}]}}'),
	('session:b5ef322a-b85f-4e1b-8368-68874df8cf2d', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "b5ef322a-b85f-4e1b-8368-68874df8cf2d", "updated_at": "2025-11-30T15:10:28.018Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T15:10:25.446Z"}], "board_state_json": {"cards": []}}'),
	('session:ffd0c084-39c8-4697-a146-d910c0783b5f', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "ffd0c084-39c8-4697-a146-d910c0783b5f", "updated_at": "2025-11-30T19:13:28.888Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:9d9e7e00-365d-4446-8b5d-94874791c12b', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "9d9e7e00-365d-4446-8b5d-94874791c12b", "updated_at": "2025-11-30T10:45:44.930Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T10:45:43.134Z"}, {"biom": {"id": "7e12c8e7-e17a-422d-ae4e-551c52488517", "name": "Wasserarena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle wassereffekte", "", "", ""], "element": "Water", "created_at": "2025-11-29T00:07:50.457Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 2}, "mutation": {"id": "3e2238c1-8ea0-44c5-b933-2c5ee236fa13", "name": "von deiner Mama", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x w6 würfeln, wenn du unter 8 kommst, erleidest 2 Schaden", "", "", ""], "element": "Neutral", "created_at": "2025-11-29T00:14:22.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:15:29.859Z", "image_asset": "", "trigger_dice_value": 2}, "arenaName": "Wasserarena von der Mama", "timestamp": "2025-11-30T10:45:33.178Z"}], "board_state_json": {"cards": []}}'),
	('session:6267a25f-6582-4096-99b8-b8ca56f61694', '{"p1_hp": 20, "p2_hp": 20, "session_id": "6267a25f-6582-4096-99b8-b8ca56f61694", "updated_at": "2025-11-28T23:21:23.868Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 8.1953125, "y": 280.796875}}]}}'),
	('session:a260a4b4-1294-4beb-9809-6f939eb070dc', '{"p1_hp": 20, "p2_hp": 20, "session_id": "a260a4b4-1294-4beb-9809-6f939eb070dc", "updated_at": "2025-11-28T23:12:24.543Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:40a1c19e-3a37-48fc-858f-22feae9bdf72', '{"p1_hp": 20, "p2_hp": 20, "session_id": "40a1c19e-3a37-48fc-858f-22feae9bdf72", "updated_at": "2025-11-28T23:13:10.606Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 1, "position": {"x": 62.2, "y": 342.8}}]}}'),
	('session:126e0e9a-9cac-40cd-ac62-2ca44c206ffa', '{"p1_hp": 20, "p2_hp": 20, "session_id": "126e0e9a-9cac-40cd-ac62-2ca44c206ffa", "updated_at": "2025-11-28T23:11:22.952Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 4, "position": {"x": 22.1953125, "y": 268.796875}}]}}'),
	('session:097d74fc-deb3-4b1a-9698-c6e4aa7dce9b', '{"p1_hp": 20, "p2_hp": 20, "session_id": "097d74fc-deb3-4b1a-9698-c6e4aa7dce9b", "updated_at": "2025-11-28T23:09:18.085Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 41.1953125, "y": 337.796875}}]}}'),
	('session:9761e2d9-0ac0-4272-b37a-6244dd883466', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "9761e2d9-0ac0-4272-b37a-6244dd883466", "updated_at": "2025-11-30T15:15:10.483Z", "dice_history": [{"biom": {"id": "mock-biom-1", "name": "🔥 Vulkan Base (MOCK)", "type": "Arena_Biom", "effects": ["Burn Damage +2", "Heat Wave on Roll 5+"], "element": "Fire", "trigger_dice_value": 3}, "mutation": {"id": "mock-mutation-1", "name": "⚡ Lava Burst (MOCK)", "type": "Arena_Mutation", "effects": ["Fire spread to adjacent tiles", "Melt armor -1"], "element": "Fire", "trigger_dice_value": 5}, "arenaName": "🧪 MOCK ARENA (Test)", "timestamp": "2025-11-30T15:15:07.631Z"}], "board_state_json": {"cards": []}}'),
	('session:f313f206-6a73-4b7d-b847-781dbcc928f0', '{"p1_hp": 20, "p2_hp": 20, "session_id": "f313f206-6a73-4b7d-b847-781dbcc928f0", "updated_at": "2025-11-28T23:09:18.563Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 3, "position": {"x": 180.1953125, "y": 260.796875}}]}}'),
	('session:6342f1ba-da98-45dc-80c7-2234fd56062a', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "6342f1ba-da98-45dc-80c7-2234fd56062a", "updated_at": "2025-12-01T07:06:42.055Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('card:06b4a916-93d8-4463-93ac-4a0990911b2e', '{"id": "06b4a916-93d8-4463-93ac-4a0990911b2e", "name": "der Hirnlosen", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x für jeden Angriff würfeln und den schlechteren Wert nehmen", "", "", ""], "element": "Neutral", "created_at": "2025-11-30T17:19:13.278Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 3}'),
	('session:d0327b20-fa7e-457f-a954-e592c417c897', '{"p1_hp": 20, "p2_hp": 20, "session_id": "d0327b20-fa7e-457f-a954-e592c417c897", "updated_at": "2025-11-28T23:21:43.969Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 30.1953125, "y": 328.796875}}]}}'),
	('session:6e9468ba-2975-40e9-a705-80c23469f073', '{"p1_hp": 20, "p2_hp": 20, "session_id": "6e9468ba-2975-40e9-a705-80c23469f073", "updated_at": "2025-11-28T23:19:09.950Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": -124.8046875, "y": 384.796875}}]}}'),
	('session:914283b7-293e-4340-9422-4d37734abe7a', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "914283b7-293e-4340-9422-4d37734abe7a", "updated_at": "2025-11-30T19:20:25.912Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:36925a34-435b-4a76-a597-3c1a60564cee', '{"p1_hp": 20, "p2_hp": 20, "session_id": "36925a34-435b-4a76-a597-3c1a60564cee", "updated_at": "2025-11-28T23:26:19.450Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "0ce7298c-69e8-477a-b406-80d2b79ffca4", "zIndex": 3, "position": {"x": 646.1953125, "y": 300.796875}}]}}'),
	('session:5f855c0c-5c1b-43bb-afa6-b6cf508bfe77', '{"p1_hp": 20, "p2_hp": 20, "session_id": "5f855c0c-5c1b-43bb-afa6-b6cf508bfe77", "updated_at": "2025-11-28T23:26:50.130Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('arena:e60d5193-4933-4d36-9dd3-77071e59e02b', '{"id": "e60d5193-4933-4d36-9dd3-77071e59e02b", "name": "Feuer-Arena der Hirnlosen", "created_at": "2025-11-30T17:19:46.905Z", "biom_card_id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "mutation_card_id": "06b4a916-93d8-4463-93ac-4a0990911b2e"}'),
	('session:11298bdd-f3db-465d-a624-6a2dab283037', '{"p1_hp": 20, "p2_hp": 20, "session_id": "11298bdd-f3db-465d-a624-6a2dab283037", "updated_at": "2025-11-28T23:23:42.996Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 52.1953125, "y": 324.796875}}]}}'),
	('session:b4d4701c-5f33-45f2-96c1-3c46aa4e034a', '{"p1_hp": 20, "p2_hp": 20, "session_id": "b4d4701c-5f33-45f2-96c1-3c46aa4e034a", "updated_at": "2025-11-28T23:30:06.598Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 122.1953125, "y": 331.796875}}]}}'),
	('session:a7d20108-2d55-4fb2-89b8-03db699dd76a', '{"p1_hp": 20, "p2_hp": 20, "session_id": "a7d20108-2d55-4fb2-89b8-03db699dd76a", "updated_at": "2025-11-28T23:31:41.007Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:16310b00-3494-4d3b-b3fe-e11ea9284dcc', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "16310b00-3494-4d3b-b3fe-e11ea9284dcc", "updated_at": "2025-11-30T19:21:50.919Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:759492cf-ab6c-4b5c-bf78-b4b629784fc5', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "759492cf-ab6c-4b5c-bf78-b4b629784fc5", "updated_at": "2025-12-01T07:07:20.930Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 103, "position": {"x": 70.1953125, "y": 262.796875}}]}}'),
	('session:ce21aada-06dc-46c3-a65f-a38cdc9a9491', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "ce21aada-06dc-46c3-a65f-a38cdc9a9491", "updated_at": "2025-11-30T15:16:51.894Z", "dice_history": [{"biom": {"id": "mock-biom-1", "name": "🔥 Vulkan Base (MOCK)", "type": "Arena_Biom", "effects": ["Burn Damage +2", "Heat Wave on Roll 5+"], "element": "Fire", "trigger_dice_value": 3}, "mutation": {"id": "mock-mutation-1", "name": "⚡ Lava Burst (MOCK)", "type": "Arena_Mutation", "effects": ["Fire spread to adjacent tiles", "Melt armor -1"], "element": "Fire", "trigger_dice_value": 5}, "arenaName": "🧪 MOCK ARENA (Test)", "timestamp": "2025-11-30T15:16:50.035Z"}], "board_state_json": {"cards": []}}'),
	('session:b4aaf9eb-1e99-4ce1-95cd-b889b74b75e8', '{"p1_hp": 20, "p2_hp": 20, "session_id": "b4aaf9eb-1e99-4ce1-95cd-b889b74b75e8", "updated_at": "2025-11-28T23:29:56.267Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('card:f94ecd59-cb8d-4381-bbc9-ea18900e39a9', '{"id": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "name": "Stiernackenkommando", "type": "Character_Base", "notes": "ist zu stark in runde 3", "effects": ["kann verteidigungswürfe 1x wiederholen", "", "", ""], "element": "Neutral", "created_at": "2025-11-28T23:35:55.870Z", "stats_json": {}, "updated_at": "2025-12-02T09:34:11.651Z", "image_asset": "https://tprhkqoiomnojudkwyut.supabase.co/storage/v1/object/sign/make-c701770f-card-images/793f2ccc-53d3-4eda-8aaf-6c93447c12a2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzg2ZDE0YS0wNjlkLTRlNGItYTNiZC04YzIwYzc4YTE4NmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYWtlLWM3MDE3NzBmLWNhcmQtaW1hZ2VzLzc5M2YyY2NjLTUzZDMtNGVkYS04YWFmLTZjOTM0NDdjMTJhMi5qcGciLCJpYXQiOjE3NjQ2NjgwNDUsImV4cCI6MjA4MDAyODA0NX0.Uv9kNlgu6YVIyi51TgkhSuRsSBp8zIkHDh8CwzpoHoA"}'),
	('card:dfc56505-aecf-4376-8b79-19514925b4e0', '{"id": "dfc56505-aecf-4376-8b79-19514925b4e0", "name": "Schluckspecht Wasser", "type": "Subclass_Element", "notes": "", "effects": ["", "", "", ""], "element": "Water", "created_at": "2025-12-02T20:40:10.714Z", "stats_json": {}, "updated_at": "2025-12-02T20:42:47.640Z", "image_asset": "https://tprhkqoiomnojudkwyut.supabase.co/storage/v1/object/sign/make-c701770f-card-images/f5fc5af7-8024-417f-9158-b108fe86c82e.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzg2ZDE0YS0wNjlkLTRlNGItYTNiZC04YzIwYzc4YTE4NmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYWtlLWM3MDE3NzBmLWNhcmQtaW1hZ2VzL2Y1ZmM1YWY3LTgwMjQtNDE3Zi05MTU4LWIxMDhmZTg2YzgyZS5qcGciLCJpYXQiOjE3NjQ3MDgwMDcsImV4cCI6MjA4MDA2ODAwN30.TS5M7P6MRQCF9n-32k5TTmENzZkaNiWOdmRYC-w6ed0"}'),
	('card:0ce7298c-69e8-477a-b406-80d2b79ffca4', '{"id": "0ce7298c-69e8-477a-b406-80d2b79ffca4", "name": "Schluckspecht", "type": "Character_Base", "notes": "", "effects": ["kann wenn die arena kein wasserelement hat nochmal würfeln", "", "", ""], "element": "Neutral", "created_at": "2025-11-28T23:25:27.776Z", "stats_json": {}, "updated_at": "2025-12-02T20:48:29.464Z", "image_asset": "https://tprhkqoiomnojudkwyut.supabase.co/storage/v1/object/sign/make-c701770f-card-images/3390bbd3-21ce-4fe3-bfdc-6234aa57713e.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzg2ZDE0YS0wNjlkLTRlNGItYTNiZC04YzIwYzc4YTE4NmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYWtlLWM3MDE3NzBmLWNhcmQtaW1hZ2VzLzMzOTBiYmQzLTIxY2UtNGZlMy1iZmRjLTYyMzRhYTU3NzEzZS5qcGciLCJpYXQiOjE3NjQ3MDg1MDcsImV4cCI6MjA4MDA2ODUwN30.DLpe2N3WUASLAT4OqFaXPjLimVQd09KdNwNpQmoupA0"}'),
	('session:dc3a87ae-9d5a-4e1c-bdbb-cb8f670b5276', '{"p1_hp": 20, "p2_hp": 20, "session_id": "dc3a87ae-9d5a-4e1c-bdbb-cb8f670b5276", "updated_at": "2025-11-28T23:38:23.522Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 1, "position": {"x": 144.2, "y": 319.8}}]}}'),
	('arena:135d7194-1027-4c49-9513-225cc7e9d102', '{"id": "135d7194-1027-4c49-9513-225cc7e9d102", "name": "Wasserarena von der Mama", "created_at": "2025-11-29T00:14:40.379Z", "biom_card_id": "7e12c8e7-e17a-422d-ae4e-551c52488517", "mutation_card_id": "3e2238c1-8ea0-44c5-b933-2c5ee236fa13"}'),
	('card:3e2238c1-8ea0-44c5-b933-2c5ee236fa13', '{"id": "3e2238c1-8ea0-44c5-b933-2c5ee236fa13", "name": "von deiner Mama", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x w6 würfeln, wenn du unter 8 kommst, erleidest 2 Schaden", "", "", ""], "element": "Neutral", "created_at": "2025-11-29T00:14:22.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:15:29.859Z", "image_asset": "", "trigger_dice_value": 2}'),
	('session:189dbe3f-5f35-4f7c-addb-652bee3e1f64', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "189dbe3f-5f35-4f7c-addb-652bee3e1f64", "updated_at": "2025-11-29T00:22:06.347Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "0ce7298c-69e8-477a-b406-80d2b79ffca4", "zIndex": 11, "position": {"x": 37.86197916666667, "y": 466.796875}}, {"cardId": "c795eea1-185e-41aa-9db8-081cac770764", "zIndex": 12, "position": {"x": 283.2, "y": 299.4666666666667}}]}}'),
	('session:216a8f0e-ecf9-45cc-9c89-60dd1b6fd3b3', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "216a8f0e-ecf9-45cc-9c89-60dd1b6fd3b3", "updated_at": "2025-11-29T17:46:45.236Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 3, "position": {"x": 135.1953125, "y": 171.796875}}]}}'),
	('session:a4d166f7-6614-46f4-91a1-8fd9ed37f8fd', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a4d166f7-6614-46f4-91a1-8fd9ed37f8fd", "updated_at": "2025-11-29T17:53:04.334Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:7727ff87-8dd5-46b4-b2ff-b47a32bec5eb', '{"p1_hp": 20, "p2_hp": 20, "session_id": "7727ff87-8dd5-46b4-b2ff-b47a32bec5eb", "updated_at": "2025-11-28T23:36:13.116Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 2, "position": {"x": 64.1953125, "y": 295.796875}}]}}'),
	('session:68da6e2f-db09-4956-8677-bf627c4d39fd', '{"p1_hp": 20, "p2_hp": 20, "session_id": "68da6e2f-db09-4956-8677-bf627c4d39fd", "updated_at": "2025-11-28T23:37:17.571Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 2, "position": {"x": 90.1953125, "y": 271.796875}}]}}'),
	('arena:b61c9d1e-9d47-4b42-95e6-050d03336bca', '{"id": "b61c9d1e-9d47-4b42-95e6-050d03336bca", "name": "Wasser-Arena der Hirnlosen", "created_at": "2025-11-30T17:20:42.087Z", "biom_card_id": "7e12c8e7-e17a-422d-ae4e-551c52488517", "mutation_card_id": "06b4a916-93d8-4463-93ac-4a0990911b2e"}'),
	('session:959d2524-2658-402b-b423-a0d3bae71dfa', '{"p1_hp": 18, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "959d2524-2658-402b-b423-a0d3bae71dfa", "updated_at": "2025-11-29T15:52:16.368Z", "dice_history": [{"type": "W20", "value": 20, "timestamp": "2025-11-29T15:52:10.739Z"}, {"type": "W12", "value": 3, "timestamp": "2025-11-29T15:52:06.727Z"}], "board_state_json": {"cards": []}}'),
	('session:b7daa58e-9d86-490e-953a-16937e76aa35', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "b7daa58e-9d86-490e-953a-16937e76aa35", "updated_at": "2025-11-30T19:39:21.140Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:ef5cdb16-097f-4bd1-a378-58e7387d45d6', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "ef5cdb16-097f-4bd1-a378-58e7387d45d6", "updated_at": "2025-11-29T00:32:27.544Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 107.1953125, "y": 271.796875}}]}}'),
	('card:dd0e227c-432b-4008-8fb9-cab8bc12b6e2', '{"id": "dd0e227c-432b-4008-8fb9-cab8bc12b6e2", "name": "Knuspergnom Feuer", "type": "Subclass_Element", "notes": "", "effects": ["", "", "", ""], "element": "Fire", "created_at": "2025-12-02T20:45:59.196Z", "stats_json": {}, "image_asset": "https://tprhkqoiomnojudkwyut.supabase.co/storage/v1/object/sign/make-c701770f-card-images/30f0d721-e53f-42a4-91c2-23abd27adaac.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzg2ZDE0YS0wNjlkLTRlNGItYTNiZC04YzIwYzc4YTE4NmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYWtlLWM3MDE3NzBmLWNhcmQtaW1hZ2VzLzMwZjBkNzIxLWU1M2YtNDJhNC05MWMyLTIzYWJkMjdhZGFhYy5qcGciLCJpYXQiOjE3NjQ3MDgzNTMsImV4cCI6MjA4MDA2ODM1M30.nTf_Ha6P-VwUtMp55lV-_S7-NIUQ41qb-YU-7_IjcjM"}'),
	('session:007666bd-3c44-4768-ad63-9c1b5dd23af2', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "007666bd-3c44-4768-ad63-9c1b5dd23af2", "updated_at": "2025-11-29T17:44:56.414Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 101.2, "y": 191.8}}]}}'),
	('session:ddcf4829-1c3a-4902-a227-a0c66a1460b5', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "ddcf4829-1c3a-4902-a227-a0c66a1460b5", "updated_at": "2025-11-29T18:01:32.329Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 4, "position": {"x": 61.07231486344993, "y": 233.4122225115281}}, {"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 6, "position": {"x": 515.1039736939008, "y": 215.4084044784761}}]}}'),
	('session:40ab794a-0445-4f00-996c-6ca6e5a3d9e1', '{"p1_hp": 20, "p2_hp": 20, "session_id": "40ab794a-0445-4f00-996c-6ca6e5a3d9e1", "updated_at": "2025-11-28T23:43:02.655Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 103.2, "y": 300.8}}]}}'),
	('session:0429f5f0-0e28-4729-ba42-a7d93b3cfc1c', '{"p1_hp": 20, "p2_hp": 20, "session_id": "0429f5f0-0e28-4729-ba42-a7d93b3cfc1c", "updated_at": "2025-11-28T23:44:53.550Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:7a1f63ea-63f4-4087-9780-9296d2eb428f', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "7a1f63ea-63f4-4087-9780-9296d2eb428f", "updated_at": "2025-11-29T00:24:37.284Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-29T00:23:23.231Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 1, "position": {"x": 151.2, "y": 274.8}}]}}'),
	('card:e29838a9-61d0-4769-8f21-70c158f431d7', '{"id": "e29838a9-61d0-4769-8f21-70c158f431d7", "name": "Knuspergnom Licht", "type": "Subclass_Element", "notes": "", "effects": ["", "", "", ""], "element": "Light", "created_at": "2025-11-29T00:28:12.416Z", "stats_json": {}, "image_asset": "https://tprhkqoiomnojudkwyut.supabase.co/storage/v1/object/sign/make-c701770f-card-images/2578d0f5-26fe-4270-8fd6-3919188f9a84.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzg2ZDE0YS0wNjlkLTRlNGItYTNiZC04YzIwYzc4YTE4NmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYWtlLWM3MDE3NzBmLWNhcmQtaW1hZ2VzLzI1NzhkMGY1LTI2ZmUtNDI3MC04ZmQ2LTM5MTkxODhmOWE4NC5qcGciLCJpYXQiOjE3NjQzNzYwOTEsImV4cCI6MjA3OTczNjA5MX0.8WnfxD8NVpw8xN4wAHnABMsrk41NRoidwBNnumfJMNY"}'),
	('session:87299d62-8ed9-4e06-a4ac-c45848bbbdaa', '{"p1_hp": 20, "p2_hp": 20, "session_id": "87299d62-8ed9-4e06-a4ac-c45848bbbdaa", "updated_at": "2025-11-28T23:45:16.387Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-28T22:51:12.588Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-28T23:45:03.774Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 77.2, "y": 331.8}}]}}'),
	('session:b32504b7-0418-4e05-a78e-8b1792efa60b', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "b32504b7-0418-4e05-a78e-8b1792efa60b", "updated_at": "2025-11-29T00:29:58.099Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 3, "position": {"x": 114.1953125, "y": 279.796875}}, {"cardId": "c795eea1-185e-41aa-9db8-081cac770764", "zIndex": 7, "position": {"x": 101.1953125, "y": 20.796875}}]}}'),
	('session:b5db4c97-eba9-4542-a3a7-b52a9d1a2538', '{"p1_hp": 20, "p2_hp": 20, "session_id": "b5db4c97-eba9-4542-a3a7-b52a9d1a2538", "updated_at": "2025-11-28T23:42:59.958Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:3476659b-be82-44af-a0f4-bbe01e5eadae', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "3476659b-be82-44af-a0f4-bbe01e5eadae", "updated_at": "2025-11-29T00:34:04.056Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": null}, {"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 4, "position": {"x": 126.1953125, "y": 243.796875}}]}}'),
	('session:07f81f13-8a59-4013-bc45-4282c7321fdb', '{"p1_hp": 20, "p2_hp": 20, "session_id": "07f81f13-8a59-4013-bc45-4282c7321fdb", "updated_at": "2025-11-28T23:46:50.911Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 3, "position": {"x": -2.8046875, "y": 278.796875}}]}}'),
	('arena:36ba72a3-dbbc-4f38-b418-14bb74165ac0', '{"id": "36ba72a3-dbbc-4f38-b418-14bb74165ac0", "name": "Feuerarena von deiner Mama", "created_at": "2025-11-29T00:14:58.563Z", "biom_card_id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "mutation_card_id": "3e2238c1-8ea0-44c5-b933-2c5ee236fa13"}'),
	('session:440efb57-5eb9-46bc-934a-69e9eb4085d7', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "440efb57-5eb9-46bc-934a-69e9eb4085d7", "updated_at": "2025-11-29T00:15:38.222Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:f6b2ef06-a9c4-4857-87cd-62a6b58343e7', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "f6b2ef06-a9c4-4857-87cd-62a6b58343e7", "updated_at": "2025-11-30T19:41:16.963Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:580a7a07-8bf0-4573-acad-7fd2ea1912b4', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "580a7a07-8bf0-4573-acad-7fd2ea1912b4", "updated_at": "2025-11-29T17:53:35.883Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:9fb98a5e-0759-4b40-a9c9-cbc3d938a3b6', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "9fb98a5e-0759-4b40-a9c9-cbc3d938a3b6", "updated_at": "2025-11-29T17:37:25.947Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 4, "position": {"x": 50.1953125, "y": 282.796875}}, {"cardId": "c795eea1-185e-41aa-9db8-081cac770764", "zIndex": 6, "position": {"x": 252.1953125, "y": 219.796875}}]}}'),
	('session:c7d84925-4d36-4a2d-bbd7-f812d20ce46d', '{"p1_hp": 20, "p2_hp": 20, "session_id": "c7d84925-4d36-4a2d-bbd7-f812d20ce46d", "updated_at": "2025-11-28T23:49:22.713Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 18, "position": {"x": 59.1953125, "y": 346.796875}}]}}'),
	('session:5ab24af9-65af-48a9-8c4c-400cdd2d8a16', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "5ab24af9-65af-48a9-8c4c-400cdd2d8a16", "updated_at": "2025-11-29T00:28:29.343Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "e29838a9-61d0-4769-8f21-70c158f431d7", "zIndex": 2, "position": {"x": 32.1953125, "y": 55.796875}}]}}'),
	('session:3554b16f-6dda-462e-a1d9-dc6ece703832', '{"p1_hp": 20, "p2_hp": 20, "session_id": "3554b16f-6dda-462e-a1d9-dc6ece703832", "updated_at": "2025-11-28T23:52:39.274Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 3, "position": {"x": 50.1953125, "y": 319.796875}}, {"cardId": "c795eea1-185e-41aa-9db8-081cac770764", "zIndex": 4, "position": {"x": 75.2, "y": 32.80000000000001}}]}}'),
	('session:425a28a1-377a-4768-84e2-f65b2987365f', '{"p1_hp": 20, "p2_hp": 20, "session_id": "425a28a1-377a-4768-84e2-f65b2987365f", "updated_at": "2025-11-28T23:51:45.358Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "c795eea1-185e-41aa-9db8-081cac770764", "zIndex": 4, "position": {"x": 42.1953125, "y": 59.796875}}, {"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 5, "position": {"x": 48.2, "y": 288.8}}]}}'),
	('card:c795eea1-185e-41aa-9db8-081cac770764', '{"id": "c795eea1-185e-41aa-9db8-081cac770764", "name": "Knuspergnom Schatten", "type": "Subclass_Element", "notes": "", "effects": ["wenn er von einem lichtelement angegriffen wird muss er 1x W6 würfeln. wenn über 4 ist bekommt keinen extra schaden, wenn darunter +2 extra schaden", "", "", ""], "element": "Shadow", "created_at": "2025-11-28T23:51:26.092Z", "stats_json": {}, "updated_at": "2025-11-29T00:06:14.666Z", "image_asset": "https://tprhkqoiomnojudkwyut.supabase.co/storage/v1/object/sign/make-c701770f-card-images/4a0fa89b-b424-4394-a357-37e330bf9030.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzg2ZDE0YS0wNjlkLTRlNGItYTNiZC04YzIwYzc4YTE4NmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYWtlLWM3MDE3NzBmLWNhcmQtaW1hZ2VzLzRhMGZhODliLWI0MjQtNDM5NC1hMzU3LTM3ZTMzMGJmOTAzMC5qcGciLCJpYXQiOjE3NjQzNzM3ODUsImV4cCI6MjA3OTczMzc4NX0.U-uvezrlvtBbW03lV_PGi33PiFNjgAUDeq2Lw2k3k7c"}'),
	('session:fafe9a3f-4fff-4ebc-8a7a-52021922dd1f', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "fafe9a3f-4fff-4ebc-8a7a-52021922dd1f", "updated_at": "2025-11-29T00:18:49.867Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:f50c3571-565d-4821-a5ca-4b4db69a25ba', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "f50c3571-565d-4821-a5ca-4b4db69a25ba", "updated_at": "2025-11-29T17:59:49.797Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-29T17:59:47.760Z"}], "board_state_json": {"cards": []}}'),
	('session:0feac9c8-b5b6-4d9c-9d55-c5a9fe24253d', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "0feac9c8-b5b6-4d9c-9d55-c5a9fe24253d", "updated_at": "2025-11-29T00:25:17.352Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 8, "position": {"x": 400.20311914814044, "y": 471.0077732576839}}]}}'),
	('session:f77ef444-c757-46e0-bbf6-c9d7f62b4089', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "f77ef444-c757-46e0-bbf6-c9d7f62b4089", "updated_at": "2025-11-29T00:30:46.484Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 9, "position": {"x": -89.14583333333334, "y": 271.45833333333337}}]}}'),
	('session:e15bf922-912d-4a00-aa9e-213910555df0', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "e15bf922-912d-4a00-aa9e-213910555df0", "updated_at": "2025-11-29T00:34:27.042Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:4cbbc969-3f86-4b93-a401-62066e5123f1', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "4cbbc969-3f86-4b93-a401-62066e5123f1", "updated_at": "2025-11-29T17:49:30.050Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 3, "position": {"x": 37.78736809118473, "y": 155.2197877161316}}]}}'),
	('session:8df10a6e-1673-4d7c-b66b-a19e15542310', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "8df10a6e-1673-4d7c-b66b-a19e15542310", "updated_at": "2025-11-29T18:01:42.237Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-29T18:01:40.584Z"}], "board_state_json": {"cards": []}}'),
	('session:a020b0c0-073b-433f-859b-6746f95eca7c', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a020b0c0-073b-433f-859b-6746f95eca7c", "updated_at": "2025-11-29T00:08:54.506Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:123484a8-f8b7-49b3-959f-52b9c732808e', '{"p1_hp": 20, "p2_hp": 20, "session_id": "123484a8-f8b7-49b3-959f-52b9c732808e", "updated_at": "2025-11-28T23:53:01.460Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-28T22:51:12.588Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-28T23:52:55.691Z"}], "board_state_json": {"cards": []}}'),
	('session:955ba07c-b10d-4fc4-94ea-081e12ff6d9e', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "955ba07c-b10d-4fc4-94ea-081e12ff6d9e", "updated_at": "2025-11-28T23:59:15.382Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:f6aec2b2-031c-4edb-8ab7-9b305e163a4d', '{"p1_hp": 20, "p2_hp": 20, "session_id": "f6aec2b2-031c-4edb-8ab7-9b305e163a4d", "updated_at": "2025-11-28T23:55:51.846Z", "dice_history": [{"type": "W12", "value": 4, "timestamp": "2025-11-28T23:55:51.508Z"}, {"type": "W6", "value": 2, "timestamp": "2025-11-28T23:55:49.215Z"}, {"type": "W6", "value": 3, "timestamp": "2025-11-28T23:55:47.323Z"}, {"type": "W6", "value": 6, "timestamp": "2025-11-28T23:55:23.373Z"}], "board_state_json": {"cards": [{"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 8, "position": {"x": 35.1953125, "y": 314.796875}}, {"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 4, "position": {"x": 632.1953125, "y": 323.796875}}]}}'),
	('session:ae11a8f5-4fee-4d0e-94f5-2f84744d7c38', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "ae11a8f5-4fee-4d0e-94f5-2f84744d7c38", "updated_at": "2025-11-28T23:56:22.180Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:4f449849-23a2-457f-87a6-cafb3d1a25b1', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "4f449849-23a2-457f-87a6-cafb3d1a25b1", "updated_at": "2025-11-29T00:02:16.859Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:bceb728a-cdda-4039-b7f7-8b807893548b', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "bceb728a-cdda-4039-b7f7-8b807893548b", "updated_at": "2025-11-28T23:57:03.628Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:84ff7c47-f285-4ecd-b7f4-4f282ff67a70', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "84ff7c47-f285-4ecd-b7f4-4f282ff67a70", "updated_at": "2025-11-29T00:12:39.729Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:0a5ab0cb-4da1-44ba-9f11-b8abdf0bea49', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "0a5ab0cb-4da1-44ba-9f11-b8abdf0bea49", "updated_at": "2025-11-29T00:05:19.071Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:f535aad4-66c2-42ca-bc28-8c262ef7cc6c', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "f535aad4-66c2-42ca-bc28-8c262ef7cc6c", "updated_at": "2025-11-28T23:57:31.569Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:a149488d-a1d1-41da-911d-a7f497497de8', '{"p1_hp": 24, "p2_hp": 20, "session_id": "a149488d-a1d1-41da-911d-a7f497497de8", "updated_at": "2025-11-28T23:53:51.775Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:39f8b2ca-6b52-4ce8-a0cb-99f0e86302c7', '{"p1_hp": 20, "p2_hp": 20, "session_id": "39f8b2ca-6b52-4ce8-a0cb-99f0e86302c7", "updated_at": "2025-11-28T23:54:19.546Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:f32c1932-c3e4-44aa-a2ee-dc63fcb33951', '{"p1_hp": 20, "p2_hp": 20, "session_id": "f32c1932-c3e4-44aa-a2ee-dc63fcb33951", "updated_at": "2025-11-28T23:54:48.017Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:97ba1e7d-23fc-4259-b438-2f13dcba5479', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "97ba1e7d-23fc-4259-b438-2f13dcba5479", "updated_at": "2025-11-28T23:57:39.039Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:8246dfaf-429d-4dcf-9aa6-83d0fb672c66', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "8246dfaf-429d-4dcf-9aa6-83d0fb672c66", "updated_at": "2025-11-29T00:06:36.977Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:bf0ef1cf-ebf8-4008-ba2d-3adf304e6df8', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "bf0ef1cf-ebf8-4008-ba2d-3adf304e6df8", "updated_at": "2025-11-28T23:57:52.936Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session_index', '["c29a2dc5-c926-4914-acbe-e32ac94df9d6", "e67a0e27-a850-48d1-bb08-58eb45fb5365", "27a3771c-6eb3-4b57-be30-cdc59cab91f6", "c606aad7-7b37-485f-958c-a6334d9f5cd5", "c00efbdc-8c6a-4366-98eb-59546bfae4b3", "143d94dc-ad11-49a6-bcc8-c51c68b2f53b", "0b630d6e-60f5-473e-b9c0-55e4ec8164b0", "e7681217-b9d6-4af3-a5df-d98117245e73", "9d9b1da5-aa5b-4a93-bc8c-df0636095de3", "9579a237-a562-453e-bfd1-5206388375c8", "ddc9ff63-2c98-4470-be51-8f21cd09b099", "db5157b5-ccfb-40da-b885-40f50d1bb390", "0a340a5d-6274-4399-a76c-4cb32461e5c3", "6f6cbcf4-62bf-4451-90f2-17b633b57393", "b819517e-a287-4aba-89fb-fc0680b77154", "cce9808a-415b-4530-bcdd-8e952528d161", "ce1a8f8e-ef9e-40ec-9159-02aeac27d546", "76fce32e-9283-4d31-bf21-f0687fd97762", "33b9aa86-612f-418c-bfa1-88e60e84fc46", "600142ea-c475-46e2-8cba-a7f0906bcb0c", "cfaba2b7-a6e0-4a92-9d65-bf20191badf1", "87b2e74a-3d44-476e-a950-a1209af1852c", "097d74fc-deb3-4b1a-9698-c6e4aa7dce9b", "f313f206-6a73-4b7d-b847-781dbcc928f0", "126e0e9a-9cac-40cd-ac62-2ca44c206ffa", "a260a4b4-1294-4beb-9809-6f939eb070dc", "40a1c19e-3a37-48fc-858f-22feae9bdf72", "6e9468ba-2975-40e9-a705-80c23469f073", "6267a25f-6582-4096-99b8-b8ca56f61694", "d0327b20-fa7e-457f-a954-e592c417c897", "11298bdd-f3db-465d-a624-6a2dab283037", "36925a34-435b-4a76-a597-3c1a60564cee", "5f855c0c-5c1b-43bb-afa6-b6cf508bfe77", "b4d4701c-5f33-45f2-96c1-3c46aa4e034a", "b4aaf9eb-1e99-4ce1-95cd-b889b74b75e8", "a7d20108-2d55-4fb2-89b8-03db699dd76a", "7727ff87-8dd5-46b4-b2ff-b47a32bec5eb", "68da6e2f-db09-4956-8677-bf627c4d39fd", "dc3a87ae-9d5a-4e1c-bdbb-cb8f670b5276", "40ab794a-0445-4f00-996c-6ca6e5a3d9e1", "b5db4c97-eba9-4542-a3a7-b52a9d1a2538", "0429f5f0-0e28-4729-ba42-a7d93b3cfc1c", "87299d62-8ed9-4e06-a4ac-c45848bbbdaa", "07f81f13-8a59-4013-bc45-4282c7321fdb", "c7d84925-4d36-4a2d-bbd7-f812d20ce46d", "425a28a1-377a-4768-84e2-f65b2987365f", "3554b16f-6dda-462e-a1d9-dc6ece703832", "123484a8-f8b7-49b3-959f-52b9c732808e", "a149488d-a1d1-41da-911d-a7f497497de8", "39f8b2ca-6b52-4ce8-a0cb-99f0e86302c7", "f32c1932-c3e4-44aa-a2ee-dc63fcb33951", "f6aec2b2-031c-4edb-8ab7-9b305e163a4d", "ae11a8f5-4fee-4d0e-94f5-2f84744d7c38", "bceb728a-cdda-4039-b7f7-8b807893548b", "f535aad4-66c2-42ca-bc28-8c262ef7cc6c", "97ba1e7d-23fc-4259-b438-2f13dcba5479", "bf0ef1cf-ebf8-4008-ba2d-3adf304e6df8", "55935246-8f18-4bfd-96d8-119b0c836c41", "955ba07c-b10d-4fc4-94ea-081e12ff6d9e", "4f449849-23a2-457f-87a6-cafb3d1a25b1", "0a5ab0cb-4da1-44ba-9f11-b8abdf0bea49", "8246dfaf-429d-4dcf-9aa6-83d0fb672c66", "a020b0c0-073b-433f-859b-6746f95eca7c", "84ff7c47-f285-4ecd-b7f4-4f282ff67a70", "440efb57-5eb9-46bc-934a-69e9eb4085d7", "fafe9a3f-4fff-4ebc-8a7a-52021922dd1f", "49053ec1-115a-4276-82d8-69103175643b", "189dbe3f-5f35-4f7c-addb-652bee3e1f64", "7a1f63ea-63f4-4087-9780-9296d2eb428f", "0feac9c8-b5b6-4d9c-9d55-c5a9fe24253d", "5ab24af9-65af-48a9-8c4c-400cdd2d8a16", "b32504b7-0418-4e05-a78e-8b1792efa60b", "f77ef444-c757-46e0-bbf6-c9d7f62b4089", "b9e6dc8b-c0a8-484a-96e3-177dfa6f2350", "ef5cdb16-097f-4bd1-a378-58e7387d45d6", "3476659b-be82-44af-a0f4-bbe01e5eadae", "e15bf922-912d-4a00-aa9e-213910555df0", "d4b1c8b7-55a7-42cf-8c53-1029e1ed3411", "959d2524-2658-402b-b423-a0d3bae71dfa", "9fb98a5e-0759-4b40-a9c9-cbc3d938a3b6", "cc2912d9-36a4-4058-8006-6129580d15ed", "007666bd-3c44-4768-ad63-9c1b5dd23af2", "216a8f0e-ecf9-45cc-9c89-60dd1b6fd3b3", "4cbbc969-3f86-4b93-a401-62066e5123f1", "3567c94d-876e-4b83-abb6-6ae251b5d668", "a4d166f7-6614-46f4-91a1-8fd9ed37f8fd", "580a7a07-8bf0-4573-acad-7fd2ea1912b4", "f50c3571-565d-4821-a5ca-4b4db69a25ba", "ddcf4829-1c3a-4902-a227-a0c66a1460b5", "8df10a6e-1673-4d7c-b66b-a19e15542310", "f8633849-f106-4079-b986-5d9bd88e043a", "76871a5f-2523-445c-b1c5-14b76ec548e4", "f7a47609-29a9-447f-b22a-b369103f08fd", "b0da72f0-193f-451c-a20d-1f6016de5de8", "ece581c6-d72e-440b-91ab-fb2a31d25eb9", "ff7579bd-3aa1-411a-9ca6-70960969631a", "0e3eaaf3-b6d0-4263-9f5a-009743e53129", "58748c7a-b458-42d8-98bd-2f9005dca3d3", "d6faef58-0c0f-4c4f-a7ff-56242d5d5dc9", "e8d19a0c-645b-4557-a361-dddd495b2d8e", "ba89a4a1-ecdb-46e0-974c-7258b27b2040", "801f1b9b-bb75-4814-a5e2-849370e22eda", "9d9e7e00-365d-4446-8b5d-94874791c12b", "3bb1dead-6983-4ae3-8b31-cab2b3152ad4", "e4703571-db4e-4c7e-9514-e3d5e716a16c", "72b632b2-491e-4665-9cc1-5a0757a233f2", "03eeab8b-ddf2-468b-a6dc-3ba1d93c43bf", "e245bf8b-6822-461b-ac07-dc37f0beb741", "8f6419e4-a691-48b9-ae16-2a61dcb337a2", "60f43e5c-6c43-4e45-bb9c-177b1daf2758", "a2bad677-d4ee-4615-864e-7d5b844a6388", "36c323f9-cfbf-43b2-aa2d-e747e0ac9e82", "bf32d5f4-5511-4429-9fd1-8bb79a4869f3", "3da4291a-73d4-4a03-9f95-c47de29fa066", "a206ccbf-f4ac-4caa-ae65-6548c35f2bda", "daf227a9-43c4-453f-bea2-050362c2c2ba", "b5ef322a-b85f-4e1b-8368-68874df8cf2d", "9761e2d9-0ac0-4272-b37a-6244dd883466", "ce21aada-06dc-46c3-a65f-a38cdc9a9491", "662ea2b9-14f6-44fe-80d7-d1d76e89c875", "31839b09-3198-403f-89a2-fb709f6823fa", "a5c2173e-b34c-409e-834a-ec5027460385", "a4467b75-eb90-4a85-80c1-d7641b933aba", "a8fa7f74-b33d-423e-bff8-87967ece1061", "8c02b30f-a95f-41da-ac2e-59809b47026a", "210a7040-d50f-40f1-b923-96212fd55d76", "c7f0ecaf-69a0-4a2e-bd2c-ecde09269f14", "51eead76-8b96-48ba-a663-3522a7e5f57e", "a33d9441-2bec-4963-83fb-9391fd3771bd", "42a50c42-73c8-4b69-a150-57298524f0e4", "70a650e3-f527-48ef-86f5-921473a02ba6", "20f181bb-fa71-4fb6-acec-4cf7c714790b", "f99794af-3de5-4148-b578-c268d0c78a0b", "357b7dc4-b726-48ca-9a93-3741cfb7514c", "77182219-72c7-4ecb-a6a8-2a4f35c1303e", "f0ecf9b3-067f-49a7-a13c-54b2158b90d9", "f492ade9-0489-427e-91a5-885c80a58baf", "486db22e-2a0b-481e-b626-1c0dcdb1c99a", "0a0bacf5-2791-4d35-b5ef-3e16da0c8e81", "d76a426c-3b2c-4403-8a9d-d26529be8b80", "ffd0c084-39c8-4697-a146-d910c0783b5f", "914283b7-293e-4340-9422-4d37734abe7a", "16310b00-3494-4d3b-b3fe-e11ea9284dcc", "b7daa58e-9d86-490e-953a-16937e76aa35", "f6b2ef06-a9c4-4857-87cd-62a6b58343e7", "b1e3a67f-e909-4a84-8f16-2676af139f9c", "5ea1315f-dcce-4887-a874-27d7d9e04f0d", "638ca79b-b446-4137-999b-adfacced3f5e", "51dccf92-27b1-457d-8686-9796ce510f9a", "6968ee9f-935a-4174-b8bf-d2bf2c98fc5b", "66f34de6-148d-4f57-8f32-caf4e4fcc654", "ddd9d67a-f996-4c0c-9049-3b85be6d8772", "1795269a-f759-47f0-a5d7-d8532e29bb04", "b043f641-a3d7-4904-83fd-a01b5d4e52ec", "422c418c-1f3a-46dd-9b47-678740a25192", "f536e75e-5eba-405f-bead-0b9a367cfbbe", "3e225bcb-5cad-4b89-8088-fc665f542812", "b81fb492-73a1-4333-bb74-0dd9ce8c7d10", "b61b5a96-d9fc-472e-a213-ee15119cf079", "7602a4bf-f8e4-4b78-9df6-339261e48f71", "8d67bdba-8bbe-4e3f-803b-d1f928dd9553", "e976be0d-9b77-46d4-b525-8a1ea43830ae", "0fb9513b-d5b9-4707-8a64-8e385b28b2a6", "083d6f84-0b08-48f9-be2c-5e68b0aa1c30", "4713cec8-b15a-4853-ad11-65f3581af10b", "93e237b8-c753-4594-a6b7-73a5654e0360", "bc048857-c8a1-41da-af28-7553c77c34f3", "e45f4e7c-c4b1-4407-af98-28b9b0833c2c", "6342f1ba-da98-45dc-80c7-2234fd56062a", "759492cf-ab6c-4b5c-bf78-b4b629784fc5", "e01caa83-0363-4c75-89fd-02877c8070e4", "2bcda36e-7b4d-46a5-a650-129244f3db53", "cbb1e139-23bd-4e0b-b65f-102ed26b0eae", "67c26e23-5275-4294-84ae-3e8e5b247b52", "0b1a7fbd-b192-4c44-bcfd-25bce44f7da2", "cafc971f-63fc-4cc4-9cd0-c70affd6a0bf", "58277f18-66fb-4a16-a94b-5d265e87db1f", "d5756d05-7a0f-4c87-be24-c2c089248fd8", "04bc2f9a-679e-4ea8-a966-6d88e4f1b7ba", "df0915e0-e5f5-4356-8b50-79c6676f9578", "a81e708e-dcb3-403d-8b78-f702e7eae6c7", "9c3f7511-ba9e-4679-adbe-1a44fea7cbe1", "6242518c-2c55-4149-8fc5-1dfb1c7dcead", "3fee6ce7-60ef-4353-a40c-1836dd2f3df1", "304415eb-3a81-432b-ab78-20b7213e66fe", "a41293d1-2f4e-4e39-af33-1bb774f4c732", "39fbe615-23a7-47ec-b747-d06d3ea3cf88", "65463396-b056-4421-a6f2-f1bf43b84464", "cbe8c94a-9a17-46e3-bf81-ebcb26d9a4b4", "0d230371-1eee-4f11-a5f0-e867b3c6c412", "521099ba-bf83-4aac-b9cd-442171ec5991", "a379862e-5aff-49d3-a511-34d671e9000b"]'),
	('session:55935246-8f18-4bfd-96d8-119b0c836c41', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "55935246-8f18-4bfd-96d8-119b0c836c41", "updated_at": "2025-11-28T23:58:02.132Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('card:729e994a-e460-4d80-80d0-7d489ddabba8', '{"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}'),
	('session:f8633849-f106-4079-b986-5d9bd88e043a', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "f8633849-f106-4079-b986-5d9bd88e043a", "updated_at": "2025-11-29T18:06:23.622Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-29T18:06:21.631Z"}, {"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-29T18:06:11.633Z"}], "board_state_json": {"cards": []}}'),
	('session:76871a5f-2523-445c-b1c5-14b76ec548e4', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "76871a5f-2523-445c-b1c5-14b76ec548e4", "updated_at": "2025-11-29T18:08:17.228Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-29T18:08:16.943Z"}], "board_state_json": {"cards": []}}'),
	('session:f7a47609-29a9-447f-b22a-b369103f08fd', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "f7a47609-29a9-447f-b22a-b369103f08fd", "updated_at": "2025-11-29T18:12:40.073Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-29T18:12:38.433Z"}], "board_state_json": {"cards": []}}'),
	('session:b0da72f0-193f-451c-a20d-1f6016de5de8', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "b0da72f0-193f-451c-a20d-1f6016de5de8", "updated_at": "2025-11-29T18:14:16.143Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-29T18:14:14.584Z"}], "board_state_json": {"cards": []}}'),
	('session:ece581c6-d72e-440b-91ab-fb2a31d25eb9', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "ece581c6-d72e-440b-91ab-fb2a31d25eb9", "updated_at": "2025-11-29T18:15:25.495Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:d6faef58-0c0f-4c4f-a7ff-56242d5d5dc9', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "d6faef58-0c0f-4c4f-a7ff-56242d5d5dc9", "updated_at": "2025-11-30T10:40:21.038Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:f99794af-3de5-4148-b578-c268d0c78a0b', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "f99794af-3de5-4148-b578-c268d0c78a0b", "updated_at": "2025-11-30T17:21:44.308Z", "dice_history": [{"biom": {"id": "7e12c8e7-e17a-422d-ae4e-551c52488517", "name": "Wasser-Arena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle wassereffekte", "", "", ""], "element": "Water", "created_at": "2025-11-29T00:07:50.457Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:40.602Z", "image_asset": "", "trigger_dice_value": 2}, "mutation": {"id": "06b4a916-93d8-4463-93ac-4a0990911b2e", "name": "der Hirnlosen", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x für jeden Angriff würfeln und den schlechteren Wert nehmen", "", "", ""], "element": "Neutral", "created_at": "2025-11-30T17:19:13.278Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 3}, "arenaName": "Wasser-Arena der Hirnlosen", "timestamp": "2025-11-30T17:21:42.234Z"}], "board_state_json": {"cards": []}}'),
	('session:b1e3a67f-e909-4a84-8f16-2676af139f9c', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "b1e3a67f-e909-4a84-8f16-2676af139f9c", "updated_at": "2025-11-30T19:43:11.381Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:357b7dc4-b726-48ca-9a93-3741cfb7514c', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "357b7dc4-b726-48ca-9a93-3741cfb7514c", "updated_at": "2025-11-30T17:21:57.053Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:5ea1315f-dcce-4887-a874-27d7d9e04f0d', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "5ea1315f-dcce-4887-a874-27d7d9e04f0d", "updated_at": "2025-11-30T19:43:33.872Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:e01caa83-0363-4c75-89fd-02877c8070e4', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "e01caa83-0363-4c75-89fd-02877c8070e4", "updated_at": "2025-12-01T07:07:55.352Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 103, "position": {"x": 67.19229284794524, "y": 97.30691127719568}}]}}'),
	('card:d6b89942-7884-4382-9ffd-66ab4828574e', '{"id": "d6b89942-7884-4382-9ffd-66ab4828574e", "name": "Schluckspecht Feuer", "type": "Subclass_Element", "notes": "", "effects": ["", "", "", ""], "element": "Fire", "created_at": "2025-12-02T20:47:49.686Z", "stats_json": {}, "image_asset": "https://tprhkqoiomnojudkwyut.supabase.co/storage/v1/object/sign/make-c701770f-card-images/ad126dcd-f35d-4cb8-92cf-1800880e72e9.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzg2ZDE0YS0wNjlkLTRlNGItYTNiZC04YzIwYzc4YTE4NmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYWtlLWM3MDE3NzBmLWNhcmQtaW1hZ2VzL2FkMTI2ZGNkLWYzNWQtNGNiOC05MmNmLTE4MDA4ODBlNzJlOS5qcGciLCJpYXQiOjE3NjQ3MDg0NjEsImV4cCI6MjA4MDA2ODQ2MX0.xvXRCEJ0_btvXqSxDjs8libNucnaluHW5IR8HFCGrl8"}'),
	('session:2bcda36e-7b4d-46a5-a650-129244f3db53', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "2bcda36e-7b4d-46a5-a650-129244f3db53", "updated_at": "2025-12-01T07:08:06.734Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('card:ee038d3a-da62-4f70-9c13-64d8599f8d1c', '{"id": "ee038d3a-da62-4f70-9c13-64d8599f8d1c", "name": "Schluckspecht Wind", "type": "Subclass_Element", "notes": "", "effects": ["", "", "", ""], "element": "Air", "created_at": "2025-12-02T21:00:51.112Z", "stats_json": {}, "image_asset": "https://tprhkqoiomnojudkwyut.supabase.co/storage/v1/object/sign/make-c701770f-card-images/e1536a02-7b22-47dd-9b69-8fae3c78e25f.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzg2ZDE0YS0wNjlkLTRlNGItYTNiZC04YzIwYzc4YTE4NmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYWtlLWM3MDE3NzBmLWNhcmQtaW1hZ2VzL2UxNTM2YTAyLTdiMjItNDdkZC05YjY5LThmYWUzYzc4ZTI1Zi5qcGciLCJpYXQiOjE3NjQ3MDkyNDYsImV4cCI6MjA4MDA2OTI0Nn0.fx3p_wWc-jX0MUEimopjcP1yLcDWOhi6r_jBS8Hopy0"}'),
	('session:638ca79b-b446-4137-999b-adfacced3f5e', '{"p1_hp": 0, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "638ca79b-b446-4137-999b-adfacced3f5e", "updated_at": "2025-11-30T19:44:42.992Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:0e3eaaf3-b6d0-4263-9f5a-009743e53129', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "0e3eaaf3-b6d0-4263-9f5a-009743e53129", "updated_at": "2025-11-29T22:19:16.522Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-29T18:19:11.799Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 40.1953125, "y": 251.796875}}]}}'),
	('session:ff7579bd-3aa1-411a-9ca6-70960969631a', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "ff7579bd-3aa1-411a-9ca6-70960969631a", "updated_at": "2025-11-29T18:17:58.914Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-29T18:17:08.306Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 34.1953125, "y": 131.796875}}]}}'),
	('session:662ea2b9-14f6-44fe-80d7-d1d76e89c875', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "662ea2b9-14f6-44fe-80d7-d1d76e89c875", "updated_at": "2025-11-30T15:21:46.605Z", "dice_history": [{"biom": {"id": "mock-biom-1", "name": "🔥 Vulkan Base (MOCK)", "type": "Arena_Biom", "effects": ["Burn Damage +2", "Heat Wave on Roll 5+"], "element": "Fire", "trigger_dice_value": 3}, "mutation": {"id": "mock-mutation-1", "name": "⚡ Lava Burst (MOCK)", "type": "Arena_Mutation", "effects": ["Fire spread to adjacent tiles", "Melt armor -1"], "element": "Fire", "trigger_dice_value": 5}, "arenaName": "🧪 MOCK ARENA (Test)", "timestamp": "2025-11-30T15:21:34.358Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 110.1953125, "y": 214.796875}}]}}'),
	('session:58748c7a-b458-42d8-98bd-2f9005dca3d3', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "58748c7a-b458-42d8-98bd-2f9005dca3d3", "updated_at": "2025-11-30T10:37:36.822Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T10:37:35.060Z"}], "board_state_json": {"cards": []}}'),
	('session:cbb1e139-23bd-4e0b-b65f-102ed26b0eae', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "cbb1e139-23bd-4e0b-b65f-102ed26b0eae", "updated_at": "2025-12-01T21:08:45.743Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 108, "position": {"x": 87.1953125, "y": 231.796875}}]}}'),
	('session:51dccf92-27b1-457d-8686-9796ce510f9a', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "51dccf92-27b1-457d-8686-9796ce510f9a", "updated_at": "2025-11-30T19:44:50.400Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:a8fa7f74-b33d-423e-bff8-87967ece1061', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a8fa7f74-b33d-423e-bff8-87967ece1061", "updated_at": "2025-11-30T15:38:03.681Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T15:37:44.734Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 101, "position": {"x": 690.1953125, "y": 253.796875}}]}}'),
	('session:3bb1dead-6983-4ae3-8b31-cab2b3152ad4', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "3bb1dead-6983-4ae3-8b31-cab2b3152ad4", "updated_at": "2025-11-30T10:51:47.832Z", "dice_history": [{"biom": {"id": "7e12c8e7-e17a-422d-ae4e-551c52488517", "name": "Wasserarena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle wassereffekte", "", "", ""], "element": "Water", "created_at": "2025-11-29T00:07:50.457Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 2}, "mutation": {"id": "3e2238c1-8ea0-44c5-b933-2c5ee236fa13", "name": "von deiner Mama", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x w6 würfeln, wenn du unter 8 kommst, erleidest 2 Schaden", "", "", ""], "element": "Neutral", "created_at": "2025-11-29T00:14:22.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:15:29.859Z", "image_asset": "", "trigger_dice_value": 2}, "arenaName": "Wasserarena von der Mama", "timestamp": "2025-11-30T10:50:57.411Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 4, "position": {"x": 696.2109296796796, "y": 105.5078175709888}}, {"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": -393.7869869869872, "y": 234.8410410410409}}]}}'),
	('session:a379862e-5aff-49d3-a511-34d671e9000b', '{"p1_hp": 17, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a379862e-5aff-49d3-a511-34d671e9000b", "updated_at": "2025-12-05T19:07:19.285Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "Feuer-Arena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:32.533Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "06b4a916-93d8-4463-93ac-4a0990911b2e", "name": "der Hirnlosen", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x für jeden Angriff würfeln und den schlechteren Wert nehmen", "", "", ""], "element": "Neutral", "created_at": "2025-11-30T17:19:13.278Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 3}, "arenaName": "Feuer-Arena der Hirnlosen", "timestamp": "2025-12-05T19:01:10.586Z"}, {"biom": {"id": "7e12c8e7-e17a-422d-ae4e-551c52488517", "name": "Wasser-Arena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle wassereffekte", "", "", ""], "element": "Water", "created_at": "2025-11-29T00:07:50.457Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:40.602Z", "image_asset": "", "trigger_dice_value": 2}, "mutation": {"id": "3e2238c1-8ea0-44c5-b933-2c5ee236fa13", "name": "von deiner Mama", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x w6 würfeln, wenn du unter 8 kommst, erleidest 2 Schaden", "", "", ""], "element": "Neutral", "created_at": "2025-11-29T00:14:22.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:15:29.859Z", "image_asset": "", "trigger_dice_value": 2}, "arenaName": "Wasserarena von der Mama", "timestamp": "2025-12-05T19:00:40.485Z"}, {"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "Feuer-Arena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:32.533Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-12-05T19:00:18.920Z"}], "board_state_json": {"cards": [{"cardId": "0ce7298c-69e8-477a-b406-80d2b79ffca4", "zIndex": 111, "position": {"x": 874.3491522238327, "y": 358.82304314637423}}]}}'),
	('session:6968ee9f-935a-4174-b8bf-d2bf2c98fc5b', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "6968ee9f-935a-4174-b8bf-d2bf2c98fc5b", "updated_at": "2025-11-30T19:52:02.431Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:66f34de6-148d-4f57-8f32-caf4e4fcc654', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "66f34de6-148d-4f57-8f32-caf4e4fcc654", "updated_at": "2025-11-30T19:53:40.731Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:67c26e23-5275-4294-84ae-3e8e5b247b52', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "67c26e23-5275-4294-84ae-3e8e5b247b52", "updated_at": "2025-12-01T21:17:26.379Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "Feuer-Arena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:32.533Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-12-01T21:17:04.907Z"}], "board_state_json": {"cards": [{"cardId": "0ce7298c-69e8-477a-b406-80d2b79ffca4", "zIndex": 104, "position": {"x": 29.1953125, "y": 231.796875}}]}}'),
	('session:31839b09-3198-403f-89a2-fb709f6823fa', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "31839b09-3198-403f-89a2-fb709f6823fa", "updated_at": "2025-11-30T15:26:30.939Z", "dice_history": [{"biom": {"id": "mock-biom-1", "name": "🔥 Vulkan Base (MOCK)", "type": "Arena_Biom", "effects": ["Burn Damage +2", "Heat Wave on Roll 5+"], "element": "Fire", "trigger_dice_value": 3}, "mutation": {"id": "mock-mutation-1", "name": "⚡ Lava Burst (MOCK)", "type": "Arena_Mutation", "effects": ["Fire spread to adjacent tiles", "Melt armor -1"], "element": "Fire", "trigger_dice_value": 5}, "arenaName": "🧪 MOCK ARENA (Test)", "timestamp": "2025-11-30T15:25:37.274Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 9, "position": {"x": 469.1953125, "y": 213.796875}}]}}'),
	('session:0b1a7fbd-b192-4c44-bcfd-25bce44f7da2', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "0b1a7fbd-b192-4c44-bcfd-25bce44f7da2", "updated_at": "2025-12-02T08:23:40.333Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:ddd9d67a-f996-4c0c-9049-3b85be6d8772', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "ddd9d67a-f996-4c0c-9049-3b85be6d8772", "updated_at": "2025-11-30T19:57:42.049Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:7602a4bf-f8e4-4b78-9df6-339261e48f71', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "7602a4bf-f8e4-4b78-9df6-339261e48f71", "updated_at": "2025-11-30T20:22:02.956Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "Feuer-Arena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:32.533Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T20:21:41.296Z"}, {"type": "W20", "value": 8, "timestamp": "2025-11-30T20:21:37.417Z"}, {"type": "W12", "value": 11, "timestamp": "2025-11-30T20:21:34.924Z"}, {"type": "W6", "value": 3, "timestamp": "2025-11-30T20:21:31.270Z"}, {"type": "W6", "value": 4, "timestamp": "2025-11-30T20:21:29.051Z"}, {"type": "W6", "value": 1, "timestamp": "2025-11-30T20:21:27.478Z"}, {"type": "W6", "value": 5, "timestamp": "2025-11-30T20:21:25.855Z"}, {"type": "W6", "value": 6, "timestamp": "2025-11-30T20:21:18.808Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 112, "position": {"x": 50.159418575855014, "y": 246.7667098842154}}, {"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 111, "position": {"x": 838.197096571152, "y": 273.78777191486097}}, {"cardId": "c795eea1-185e-41aa-9db8-081cac770764", "zIndex": 114, "position": {"x": 224.80604692335237, "y": 234.5788434085457}}]}}'),
	('session:8d67bdba-8bbe-4e3f-803b-d1f928dd9553', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "8d67bdba-8bbe-4e3f-803b-d1f928dd9553", "updated_at": "2025-11-30T20:23:36.449Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:1795269a-f759-47f0-a5d7-d8532e29bb04', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "1795269a-f759-47f0-a5d7-d8532e29bb04", "updated_at": "2025-11-30T20:01:17.534Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:cafc971f-63fc-4cc4-9cd0-c70affd6a0bf', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "cafc971f-63fc-4cc4-9cd0-c70affd6a0bf", "updated_at": "2025-12-02T08:25:15.023Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:8c02b30f-a95f-41da-ac2e-59809b47026a', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "8c02b30f-a95f-41da-ac2e-59809b47026a", "updated_at": "2025-11-30T15:46:08.462Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T15:43:58.986Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 105, "position": {"x": 743.1953125, "y": 208.796875}}]}}'),
	('session:e976be0d-9b77-46d4-b525-8a1ea43830ae', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "e976be0d-9b77-46d4-b525-8a1ea43830ae", "updated_at": "2025-11-30T20:27:40.792Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:58277f18-66fb-4a16-a94b-5d265e87db1f', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "58277f18-66fb-4a16-a94b-5d265e87db1f", "updated_at": "2025-12-02T08:26:04.670Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:a5c2173e-b34c-409e-834a-ec5027460385', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a5c2173e-b34c-409e-834a-ec5027460385", "updated_at": "2025-11-30T15:28:21.533Z", "dice_history": [{"biom": {"id": "mock-biom-1", "name": "🔥 Vulkan Base (MOCK)", "type": "Arena_Biom", "effects": ["Burn Damage +2", "Heat Wave on Roll 5+"], "element": "Fire", "trigger_dice_value": 3}, "mutation": {"id": "mock-mutation-1", "name": "⚡ Lava Burst (MOCK)", "type": "Arena_Mutation", "effects": ["Fire spread to adjacent tiles", "Melt armor -1"], "element": "Fire", "trigger_dice_value": 5}, "arenaName": "🧪 MOCK ARENA (Test)", "timestamp": "2025-11-30T15:27:54.755Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 103, "position": {"x": 576.1953125, "y": 260.796875}}]}}'),
	('session:b043f641-a3d7-4904-83fd-a01b5d4e52ec', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "b043f641-a3d7-4904-83fd-a01b5d4e52ec", "updated_at": "2025-11-30T20:02:34.977Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:d5756d05-7a0f-4c87-be24-c2c089248fd8', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "d5756d05-7a0f-4c87-be24-c2c089248fd8", "updated_at": "2025-12-02T08:27:17.397Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "0ce7298c-69e8-477a-b406-80d2b79ffca4", "zIndex": 100, "position": {"x": 49.2, "y": 220.8}}, {"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 102, "position": {"x": 814.1953125, "y": 226.796875}}]}}'),
	('session:0fb9513b-d5b9-4707-8a64-8e385b28b2a6', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "0fb9513b-d5b9-4707-8a64-8e385b28b2a6", "updated_at": "2025-11-30T20:28:28.162Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:210a7040-d50f-40f1-b923-96212fd55d76', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "210a7040-d50f-40f1-b923-96212fd55d76", "updated_at": "2025-11-30T15:49:33.574Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T15:49:07.023Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 101, "position": {"x": 566.1953125, "y": 258.796875}}]}}'),
	('session:422c418c-1f3a-46dd-9b47-678740a25192', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "422c418c-1f3a-46dd-9b47-678740a25192", "updated_at": "2025-11-30T20:03:03.806Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:083d6f84-0b08-48f9-be2c-5e68b0aa1c30', '{"p1_hp": 16, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "083d6f84-0b08-48f9-be2c-5e68b0aa1c30", "updated_at": "2025-11-30T20:48:40.430Z", "dice_history": [{"type": "W12", "value": 5, "timestamp": "2025-11-30T20:47:15.714Z"}, {"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "Feuer-Arena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:32.533Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "06b4a916-93d8-4463-93ac-4a0990911b2e", "name": "der Hirnlosen", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x für jeden Angriff würfeln und den schlechteren Wert nehmen", "", "", ""], "element": "Neutral", "created_at": "2025-11-30T17:19:13.278Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 3}, "arenaName": "Feuer-Arena der Hirnlosen", "timestamp": "2025-11-30T20:46:49.132Z"}, {"type": "W6", "value": 1, "timestamp": "2025-11-30T20:46:37.004Z"}, {"type": "W6", "value": 3, "timestamp": "2025-11-30T20:46:34.864Z"}, {"type": "W6", "value": 4, "timestamp": "2025-11-30T20:46:29.187Z"}, {"type": "W6", "value": 5, "timestamp": "2025-11-30T20:46:25.754Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 124, "position": {"x": 66.72577206720663, "y": 215.51360871323084}}, {"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 119, "position": {"x": 812.989162309743, "y": 224.7345513141887}}, {"cardId": "c795eea1-185e-41aa-9db8-081cac770764", "zIndex": 125, "position": {"x": 125.30400707542226, "y": 198.0487698445839}}]}}'),
	('session:04bc2f9a-679e-4ea8-a966-6d88e4f1b7ba', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "04bc2f9a-679e-4ea8-a966-6d88e4f1b7ba", "updated_at": "2025-12-02T08:27:33.972Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:df0915e0-e5f5-4356-8b50-79c6676f9578', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "df0915e0-e5f5-4356-8b50-79c6676f9578", "updated_at": "2025-12-02T08:28:39.000Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:4713cec8-b15a-4853-ad11-65f3581af10b', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "4713cec8-b15a-4853-ad11-65f3581af10b", "updated_at": "2025-12-01T06:54:02.010Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:c7f0ecaf-69a0-4a2e-bd2c-ecde09269f14', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "c7f0ecaf-69a0-4a2e-bd2c-ecde09269f14", "updated_at": "2025-11-30T15:50:23.156Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "3e2238c1-8ea0-44c5-b933-2c5ee236fa13", "name": "von deiner Mama", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x w6 würfeln, wenn du unter 8 kommst, erleidest 2 Schaden", "", "", ""], "element": "Neutral", "created_at": "2025-11-29T00:14:22.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:15:29.859Z", "image_asset": "", "trigger_dice_value": 2}, "arenaName": "Feuerarena von deiner Mama", "timestamp": "2025-11-30T15:50:21.630Z"}, {"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T15:50:16.013Z"}, {"biom": {"id": "mock-biom-1", "name": "🔥 Vulkan Base (MOCK)", "type": "Arena_Biom", "effects": ["Burn Damage +2", "Heat Wave on Roll 5+"], "element": "Fire", "trigger_dice_value": 3}, "mutation": {"id": "mock-mutation-1", "name": "⚡ Lava Burst (MOCK)", "type": "Arena_Mutation", "effects": ["Fire spread to adjacent tiles", "Melt armor -1"], "element": "Fire", "trigger_dice_value": 5}, "arenaName": "🧪 MOCK ARENA (Test)", "timestamp": "2025-11-30T15:50:11.948Z"}], "board_state_json": {"cards": []}}'),
	('session:f536e75e-5eba-405f-bead-0b9a367cfbbe', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "f536e75e-5eba-405f-bead-0b9a367cfbbe", "updated_at": "2025-11-30T20:08:47.148Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:a81e708e-dcb3-403d-8b78-f702e7eae6c7', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a81e708e-dcb3-403d-8b78-f702e7eae6c7", "updated_at": "2025-12-02T08:29:16.232Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:3e225bcb-5cad-4b89-8088-fc665f542812', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "3e225bcb-5cad-4b89-8088-fc665f542812", "updated_at": "2025-11-30T20:09:37.464Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:51eead76-8b96-48ba-a663-3522a7e5f57e', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "51eead76-8b96-48ba-a663-3522a7e5f57e", "updated_at": "2025-11-30T15:56:11.650Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T15:54:58.465Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 101, "position": {"x": 658.1953125, "y": 220.796875}}]}}'),
	('session:93e237b8-c753-4594-a6b7-73a5654e0360', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "93e237b8-c753-4594-a6b7-73a5654e0360", "updated_at": "2025-12-01T07:03:02.027Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 101, "position": {"x": 144.6405569760854, "y": 291.869685817703}}]}}'),
	('session:e4703571-db4e-4c7e-9514-e3d5e716a16c', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "e4703571-db4e-4c7e-9514-e3d5e716a16c", "updated_at": "2025-11-30T14:49:43.736Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T14:49:40.220Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 1, "position": {"x": 197.2, "y": 229.8}}]}}'),
	('session:a33d9441-2bec-4963-83fb-9391fd3771bd', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a33d9441-2bec-4963-83fb-9391fd3771bd", "updated_at": "2025-11-30T15:58:49.387Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T15:58:47.944Z"}], "board_state_json": {"cards": []}}'),
	('session:9c3f7511-ba9e-4679-adbe-1a44fea7cbe1', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "9c3f7511-ba9e-4679-adbe-1a44fea7cbe1", "updated_at": "2025-12-02T08:30:24.596Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:6242518c-2c55-4149-8fc5-1dfb1c7dcead', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "6242518c-2c55-4149-8fc5-1dfb1c7dcead", "updated_at": "2025-12-02T08:31:02.074Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "Feuer-Arena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:32.533Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-12-02T08:31:00.462Z"}], "board_state_json": {"cards": []}}'),
	('session:72b632b2-491e-4665-9cc1-5a0757a233f2', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "72b632b2-491e-4665-9cc1-5a0757a233f2", "updated_at": "2025-11-30T14:51:02.086Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:3fee6ce7-60ef-4353-a40c-1836dd2f3df1', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "3fee6ce7-60ef-4353-a40c-1836dd2f3df1", "updated_at": "2025-12-02T08:31:47.679Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:03eeab8b-ddf2-468b-a6dc-3ba1d93c43bf', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "03eeab8b-ddf2-468b-a6dc-3ba1d93c43bf", "updated_at": "2025-11-30T14:51:41.352Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T14:51:40.139Z"}, {"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "3e2238c1-8ea0-44c5-b933-2c5ee236fa13", "name": "von deiner Mama", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x w6 würfeln, wenn du unter 8 kommst, erleidest 2 Schaden", "", "", ""], "element": "Neutral", "created_at": "2025-11-29T00:14:22.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:15:29.859Z", "image_asset": "", "trigger_dice_value": 2}, "arenaName": "Feuerarena von deiner Mama", "timestamp": "2025-11-30T14:51:36.258Z"}, {"biom": {"id": "7e12c8e7-e17a-422d-ae4e-551c52488517", "name": "Wasserarena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle wassereffekte", "", "", ""], "element": "Water", "created_at": "2025-11-29T00:07:50.457Z", "stats_json": {}, "image_asset": "", "trigger_dice_value": 2}, "mutation": {"id": "3e2238c1-8ea0-44c5-b933-2c5ee236fa13", "name": "von deiner Mama", "type": "Arena_Mutation", "notes": "", "effects": ["du musst 2x w6 würfeln, wenn du unter 8 kommst, erleidest 2 Schaden", "", "", ""], "element": "Neutral", "created_at": "2025-11-29T00:14:22.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:15:29.859Z", "image_asset": "", "trigger_dice_value": 2}, "arenaName": "Wasserarena von der Mama", "timestamp": "2025-11-30T14:51:32.194Z"}], "board_state_json": {"cards": []}}'),
	('session:b81fb492-73a1-4333-bb74-0dd9ce8c7d10', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "b81fb492-73a1-4333-bb74-0dd9ce8c7d10", "updated_at": "2025-11-30T20:11:52.694Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "Feuer-Arena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:32.533Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T20:10:41.504Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 107, "position": {"x": 11.221636544611854, "y": -203.002560736323}}, {"cardId": "f94ecd59-cb8d-4381-bbc9-ea18900e39a9", "zIndex": 103, "position": {"x": 978.5777452094677, "y": 32.4323375052936}}]}}'),
	('session:e245bf8b-6822-461b-ac07-dc37f0beb741', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "e245bf8b-6822-461b-ac07-dc37f0beb741", "updated_at": "2025-11-30T14:52:33.426Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:b61b5a96-d9fc-472e-a213-ee15119cf079', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "b61b5a96-d9fc-472e-a213-ee15119cf079", "updated_at": "2025-11-30T20:13:43.261Z", "dice_history": [], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 102, "position": {"x": 108.82750814252366, "y": -375.6115388744493}}]}}'),
	('session:8f6419e4-a691-48b9-ae16-2a61dcb337a2', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "8f6419e4-a691-48b9-ae16-2a61dcb337a2", "updated_at": "2025-11-30T14:53:22.501Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T14:53:20.254Z"}], "board_state_json": {"cards": []}}'),
	('session:42a50c42-73c8-4b69-a150-57298524f0e4', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "42a50c42-73c8-4b69-a150-57298524f0e4", "updated_at": "2025-11-30T16:04:32.582Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T16:03:51.699Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 102, "position": {"x": 47.1953125, "y": 257.796875}}]}}'),
	('session:304415eb-3a81-432b-ab78-20b7213e66fe', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "304415eb-3a81-432b-ab78-20b7213e66fe", "updated_at": "2025-12-02T08:34:46.787Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "Feuer-Arena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:32.533Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-12-02T08:33:12.812Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 102, "position": {"x": 56.0390625, "y": 199.296875}}]}}'),
	('session:70a650e3-f527-48ef-86f5-921473a02ba6', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "70a650e3-f527-48ef-86f5-921473a02ba6", "updated_at": "2025-11-30T17:13:28.236Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T17:13:26.785Z"}], "board_state_json": {"cards": []}}'),
	('session:a41293d1-2f4e-4e39-af33-1bb774f4c732', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a41293d1-2f4e-4e39-af33-1bb774f4c732", "updated_at": "2025-12-02T08:37:21.976Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:60f43e5c-6c43-4e45-bb9c-177b1daf2758', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "60f43e5c-6c43-4e45-bb9c-177b1daf2758", "updated_at": "2025-11-30T14:55:52.714Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T14:55:35.369Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 2, "position": {"x": 205.2812770935896, "y": 248.3046939374151}}]}}'),
	('session:20f181bb-fa71-4fb6-acec-4cf7c714790b', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "20f181bb-fa71-4fb6-acec-4cf7c714790b", "updated_at": "2025-11-30T17:14:02.973Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:a2bad677-d4ee-4615-864e-7d5b844a6388', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "a2bad677-d4ee-4615-864e-7d5b844a6388", "updated_at": "2025-11-30T14:56:46.420Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('card:f689db8e-00a1-449f-bab0-6d6232c669e5', '{"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "Feuer-Arena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:32.533Z", "image_asset": "", "trigger_dice_value": 1}'),
	('session:39fbe615-23a7-47ec-b747-d06d3ea3cf88', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "39fbe615-23a7-47ec-b747-d06d3ea3cf88", "updated_at": "2025-12-02T08:39:50.710Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:77182219-72c7-4ecb-a6a8-2a4f35c1303e', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "77182219-72c7-4ecb-a6a8-2a4f35c1303e", "updated_at": "2025-11-30T17:49:58.283Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "Feuer-Arena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:32.533Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T17:49:04.545Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 103, "position": {"x": 28.22516978737862, "y": 257.7179797825595}}, {"cardId": "c795eea1-185e-41aa-9db8-081cac770764", "zIndex": 105, "position": {"x": 199.20121802172525, "y": 258.6954593171248}}]}}'),
	('session:36c323f9-cfbf-43b2-aa2d-e747e0ac9e82', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "36c323f9-cfbf-43b2-aa2d-e747e0ac9e82", "updated_at": "2025-11-30T14:58:52.826Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('card:7e12c8e7-e17a-422d-ae4e-551c52488517', '{"id": "7e12c8e7-e17a-422d-ae4e-551c52488517", "name": "Wasser-Arena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle wassereffekte", "", "", ""], "element": "Water", "created_at": "2025-11-29T00:07:50.457Z", "stats_json": {}, "updated_at": "2025-11-30T17:14:40.602Z", "image_asset": "", "trigger_dice_value": 2}'),
	('session:f0ecf9b3-067f-49a7-a13c-54b2158b90d9', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "f0ecf9b3-067f-49a7-a13c-54b2158b90d9", "updated_at": "2025-11-30T18:32:47.027Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:65463396-b056-4421-a6f2-f1bf43b84464', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "65463396-b056-4421-a6f2-f1bf43b84464", "updated_at": "2025-12-02T08:40:30.396Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('session:e8d19a0c-645b-4557-a361-dddd495b2d8e', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "e8d19a0c-645b-4557-a361-dddd495b2d8e", "updated_at": "2025-11-30T10:41:05.706Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T10:40:44.615Z"}, {"arenaName": "Feuerarena von deiner Mama", "timestamp": "2025-11-30T10:40:40.005Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 6, "position": {"x": 28.1953125, "y": 261.796875}}]}}'),
	('session:bf32d5f4-5511-4429-9fd1-8bb79a4869f3', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "bf32d5f4-5511-4429-9fd1-8bb79a4869f3", "updated_at": "2025-11-30T15:01:31.857Z", "dice_history": [{"biom": {"id": "f689db8e-00a1-449f-bab0-6d6232c669e5", "name": "feuerarena", "type": "Arena_Biom", "effects": ["+1 auf alle feuereffekte"], "element": "Fire", "created_at": "2025-11-28T22:36:29.198Z", "stats_json": {}, "updated_at": "2025-11-28T22:50:54.270Z", "image_asset": "", "trigger_dice_value": 1}, "mutation": {"id": "729e994a-e460-4d80-80d0-7d489ddabba8", "name": "der Schmerzen", "type": "Arena_Mutation", "effects": ["jeder charakter der über 15 Leben hat bekommt jede runde -1 leben"], "element": "Neutral", "created_at": "2025-11-28T22:39:52.615Z", "stats_json": {}, "updated_at": "2025-11-29T00:08:35.620Z", "image_asset": "", "trigger_dice_value": 1}, "arenaName": "Feuerarena der Schmerzen", "timestamp": "2025-11-30T15:01:04.068Z"}], "board_state_json": {"cards": [{"cardId": "abf9d256-08ae-4d1f-a8ba-ad786a7d7bcd", "zIndex": 1, "position": {"x": 216.5416149068314, "y": 117.1945636796658}}]}}'),
	('session:cbe8c94a-9a17-46e3-bf81-ebcb26d9a4b4', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "cbe8c94a-9a17-46e3-bf81-ebcb26d9a4b4", "updated_at": "2025-12-02T08:46:34.773Z", "dice_history": [], "board_state_json": {"cards": []}}'),
	('card:8290df8f-3eb0-4558-914f-da556bbd8f6e', '{"id": "8290df8f-3eb0-4558-914f-da556bbd8f6e", "name": "Schatten-Arena", "type": "Arena_Biom", "notes": "", "effects": ["+1 auf alle Schatteneffekte", "", "", ""], "element": "Shadow", "created_at": "2025-11-30T17:15:11.241Z", "stats_json": {}, "updated_at": "2025-11-30T17:15:37.498Z", "image_asset": "", "trigger_dice_value": 4}'),
	('session:f492ade9-0489-427e-91a5-885c80a58baf', '{"p1_hp": 20, "p2_hp": 20, "p1_notes": "", "p2_notes": "", "session_id": "f492ade9-0489-427e-91a5-885c80a58baf", "updated_at": "2025-11-30T18:33:05.092Z", "dice_history": [], "board_state_json": {"cards": []}}');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('make-c701770f-card-images', 'make-c701770f-card-images', NULL, '2025-11-28 22:57:17.178884+00', '2025-11-28 22:57:17.178884+00', false, false, 5242880, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") VALUES
	('8c4e9dbb-8955-4c8b-aeaf-9e386eaf6efd', 'make-c701770f-card-images', '31d4f911-afe9-4692-87ac-e705dc270c52.png', NULL, '2025-11-28 23:07:11.31415+00', '2025-11-28 23:07:11.31415+00', '2025-11-28 23:07:11.31415+00', '{"eTag": "\"102747c4c2ca7d25f15af5f9e86c01e0\"", "size": 2719334, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-28T23:07:12.000Z", "contentLength": 2719334, "httpStatusCode": 200}', '889c413d-2aeb-4154-a44a-b395cd65ce8a', NULL, '{}', 1),
	('b4050cd1-e08d-4009-9667-e4c33d47f621', 'make-c701770f-card-images', 'f777b2a9-7f60-4bbb-89ac-b3516d622ed0.png', NULL, '2025-11-28 23:24:46.012826+00', '2025-11-28 23:24:46.012826+00', '2025-11-28 23:24:46.012826+00', '{"eTag": "\"3f91431d6ec57a8acd1d23c9799f9b81\"", "size": 3156698, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-28T23:24:46.000Z", "contentLength": 3156698, "httpStatusCode": 200}', 'eed754dc-5065-499e-86af-5b5fffe70d3f', NULL, '{}', 1),
	('c2937280-d2a3-4073-aa90-d376e85aef11', 'make-c701770f-card-images', '9a5ff761-624f-415b-9c28-5b584abaf086.png', NULL, '2025-11-28 23:35:13.756531+00', '2025-11-28 23:35:13.756531+00', '2025-11-28 23:35:13.756531+00', '{"eTag": "\"5d61479d5a6c04b56344489d4ef4746f\"", "size": 2908321, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-28T23:35:14.000Z", "contentLength": 2908321, "httpStatusCode": 200}', '4be72244-4c37-4b3a-832e-37fb8ff2b8f5', NULL, '{}', 1),
	('b4fd6920-698a-40d7-bed5-d1cca508e35a', 'make-c701770f-card-images', '4a0fa89b-b424-4394-a357-37e330bf9030.jpg', NULL, '2025-11-28 23:49:45.75485+00', '2025-11-28 23:49:45.75485+00', '2025-11-28 23:49:45.75485+00', '{"eTag": "\"45c4a3b6f1e2ec4720356f45b1436551\"", "size": 216523, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-28T23:49:46.000Z", "contentLength": 216523, "httpStatusCode": 200}', '4c495b91-9192-4cc3-9c67-1ab88fa5b77b', NULL, '{}', 1),
	('661c5282-314e-4086-be06-799e575238bc', 'make-c701770f-card-images', '84ea3e91-f67a-429c-8dd7-dd152ebc3c19.jpg', NULL, '2025-11-29 00:27:52.167691+00', '2025-11-29 00:27:52.167691+00', '2025-11-29 00:27:52.167691+00', '{"eTag": "\"3c5e127c087d6d95d2f2085d2f82a912\"", "size": 340748, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T00:27:53.000Z", "contentLength": 340748, "httpStatusCode": 200}', '3ad45741-5bdf-4311-bb16-8ba45156b498', NULL, '{}', 1),
	('d6db136c-da36-4380-b12b-7ba2c20cb54c', 'make-c701770f-card-images', '2578d0f5-26fe-4270-8fd6-3919188f9a84.jpg', NULL, '2025-11-29 00:28:11.158785+00', '2025-11-29 00:28:11.158785+00', '2025-11-29 00:28:11.158785+00', '{"eTag": "\"71b117b1c21c0cbf05e04adff7edddea\"", "size": 341514, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T00:28:12.000Z", "contentLength": 341514, "httpStatusCode": 200}', 'c3e9dbfe-071d-41b7-a601-93f76d321b8f', NULL, '{}', 1),
	('7dea020c-37d2-40f7-a7d4-afb5d5781c27', 'make-c701770f-card-images', 'f36a7fab-fa88-499d-80f8-dd037bc57e1c.jpg', NULL, '2025-11-29 17:50:42.356721+00', '2025-11-29 17:50:42.356721+00', '2025-11-29 17:50:42.356721+00', '{"eTag": "\"d015f8c324d9bdf933116208335ee021\"", "size": 326630, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-29T17:50:43.000Z", "contentLength": 326630, "httpStatusCode": 200}', '18cbeeeb-3d36-4dc7-9914-8ea7fef46c5a', NULL, '{}', 1),
	('17ae9918-701a-4bc9-a0f3-7ed8efa2a1e4', 'make-c701770f-card-images', 'b6648125-22ec-43a5-87d1-d09ef0644e4a.jpg', NULL, '2025-12-01 07:06:57.310066+00', '2025-12-01 07:06:57.310066+00', '2025-12-01 07:06:57.310066+00', '{"eTag": "\"c31c2c32c8a725980648041a1bd57590\"", "size": 324669, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-12-01T07:06:58.000Z", "contentLength": 324669, "httpStatusCode": 200}', 'e05e5d2b-561e-4593-a097-c55f2dbab47c', NULL, '{}', 1),
	('964ca8d9-c058-432f-83e0-2f5a93d560b6', 'make-c701770f-card-images', '793f2ccc-53d3-4eda-8aaf-6c93447c12a2.jpg', NULL, '2025-12-02 09:34:05.548403+00', '2025-12-02 09:34:05.548403+00', '2025-12-02 09:34:05.548403+00', '{"eTag": "\"ba4cd44e8d60280befca78e499f9246f\"", "size": 149818, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-12-02T09:34:06.000Z", "contentLength": 149818, "httpStatusCode": 200}', '0d7026ca-f538-417a-b6bb-d46afce3dd83', NULL, '{}', 1),
	('659ad8a8-0802-4a48-9d5b-e07488e493bd', 'make-c701770f-card-images', '975fcb5f-32c9-4bb2-bf0e-f69a8d227d08.jpg', NULL, '2025-12-02 20:39:08.868414+00', '2025-12-02 20:39:08.868414+00', '2025-12-02 20:39:08.868414+00', '{"eTag": "\"66b5a13a46864fb9d03cd133dee0141e\"", "size": 152075, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-12-02T20:39:09.000Z", "contentLength": 152075, "httpStatusCode": 200}', 'b4acbf20-c38f-4349-a21b-33e44e3eedfe', NULL, '{}', 1),
	('eef959ac-8a3f-41f5-a1f7-fff17588713d', 'make-c701770f-card-images', '22138af6-9d97-425b-910a-5fe119b7fd8e.jpg', NULL, '2025-12-02 20:39:36.568328+00', '2025-12-02 20:39:36.568328+00', '2025-12-02 20:39:36.568328+00', '{"eTag": "\"5e067e8b0e2765cfb335e031ff77014f\"", "size": 426429, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-12-02T20:39:37.000Z", "contentLength": 426429, "httpStatusCode": 200}', '9e36d7f1-01c4-418e-b6c4-92ba0b6bf5e0', NULL, '{}', 1),
	('fb974bba-cf41-44b4-83a4-407af847f258', 'make-c701770f-card-images', 'f5fc5af7-8024-417f-9158-b108fe86c82e.jpg', NULL, '2025-12-02 20:40:06.984661+00', '2025-12-02 20:40:06.984661+00', '2025-12-02 20:40:06.984661+00', '{"eTag": "\"e5096715cd27b93d5c382b6f4298957d\"", "size": 461861, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-12-02T20:40:07.000Z", "contentLength": 461861, "httpStatusCode": 200}', 'a6cfb3f4-f755-465c-81fe-83288392db5f', NULL, '{}', 1),
	('de70850f-64ba-4963-ba44-3a3c8e477534', 'make-c701770f-card-images', '30f0d721-e53f-42a4-91c2-23abd27adaac.jpg', NULL, '2025-12-02 20:45:53.669174+00', '2025-12-02 20:45:53.669174+00', '2025-12-02 20:45:53.669174+00', '{"eTag": "\"ce06beb8837895bd9dfdfb725a0dd316\"", "size": 453799, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-12-02T20:45:54.000Z", "contentLength": 453799, "httpStatusCode": 200}', '2a469f62-57cc-4c1d-b54f-c772b01c9122', NULL, '{}', 1),
	('d93a837b-52cc-49b5-b507-4cc9cc4a712b', 'make-c701770f-card-images', 'ad126dcd-f35d-4cb8-92cf-1800880e72e9.jpg', NULL, '2025-12-02 20:47:41.681125+00', '2025-12-02 20:47:41.681125+00', '2025-12-02 20:47:41.681125+00', '{"eTag": "\"c2586e2ac03e0cf1f4f8bbfebbddc2b8\"", "size": 312333, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-12-02T20:47:42.000Z", "contentLength": 312333, "httpStatusCode": 200}', '51ebea81-c3ab-4df2-bf93-7e062501eb8a', NULL, '{}', 1),
	('a23e7de7-3767-4541-84ce-328f3f951b73', 'make-c701770f-card-images', '3390bbd3-21ce-4fe3-bfdc-6234aa57713e.jpg', NULL, '2025-12-02 20:48:27.742833+00', '2025-12-02 20:48:27.742833+00', '2025-12-02 20:48:27.742833+00', '{"eTag": "\"1dd3b177643f8f3a46b1165643ebe67b\"", "size": 430116, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-12-02T20:48:28.000Z", "contentLength": 430116, "httpStatusCode": 200}', '1d1b05a2-eda8-45e9-8557-b26efa9f944a', NULL, '{}', 1),
	('3d12faed-ba71-4594-a9e5-bbe8d8075af7', 'make-c701770f-card-images', 'e1536a02-7b22-47dd-9b69-8fae3c78e25f.jpg', NULL, '2025-12-02 21:00:45.902119+00', '2025-12-02 21:00:45.902119+00', '2025-12-02 21:00:45.902119+00', '{"eTag": "\"1c4c79996dda338f361d33220b00ee5e\"", "size": 609702, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-12-02T21:00:46.000Z", "contentLength": 609702, "httpStatusCode": 200}', '35d1bcc9-09a4-43d1-a635-d43539ee3f92', NULL, '{}', 1);


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict VcdLlqrStLcd8wNzIP6fSo2YEit5EmRzMv9DmzaHN8oe35vEAxSkxiR7aQPkfOb

RESET ALL;
