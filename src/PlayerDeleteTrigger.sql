DELIMITER $$

CREATE TRIGGER before_player_delete
BEFORE DELETE ON player
FOR EACH ROW
BEGIN
    -- Temporarily disable foreign key checks to allow deletion of the parent 'stats' row.
    SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

    -- Delete the related 'stats' row.
    -- The 'player' row holds the foreign key 'statsId'.
    IF OLD.statsId IS NOT NULL THEN
        DELETE FROM stats WHERE stats.id = OLD.statsId;
    END IF;
    
    -- Delete related rows from child tables that have a 'playerId'.
    DELETE FROM player_talents WHERE player_talents.playerId = OLD.id;
    DELETE FROM weapon WHERE weapon.playerId = OLD.id;
    DELETE FROM item WHERE item.playerId = OLD.id;

    -- Re-enable foreign key checks.
    SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
END$$

DELIMITER ;
