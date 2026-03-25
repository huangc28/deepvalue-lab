CREATE TABLE goose_db_version (                                                                              
		id INTEGER PRIMARY KEY AUTOINCREMENT,                                                                        
		version_id INTEGER NOT NULL,                                                                                 
		is_applied INTEGER NOT NULL,                                                                                 
		tstamp TIMESTAMP DEFAULT (datetime('now'))                                                                   
	);                                                                                                           
CREATE TABLE "published_stock_details" (                                                                     
  ticker               TEXT PRIMARY KEY,                                                                     
  report_id            TEXT NOT NULL,                                                                        
  r2_report_key        TEXT NOT NULL DEFAULT '',                                                             
  r2_detail_key        TEXT NOT NULL DEFAULT '',                                                             
  r2_detail_zh_tw_key  TEXT NOT NULL DEFAULT '',                                                             
  summary_json         TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json)),                          
  summary_json_zh_tw   TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json_zh_tw)),                    
  published_at_ms      INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),                                   
  updated_at_ms        INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)                                    
);                                                                                                           
CREATE TRIGGER trg_published_stock_details_touch_updated_at                                                  
AFTER UPDATE ON published_stock_details FOR EACH ROW                                                         
BEGIN                                                                                                        
  UPDATE published_stock_details                                                                             
  SET updated_at_ms = (unixepoch('now') * 1000)                                                              
  WHERE ticker = NEW.ticker;                                                                                 
END;                                                                                                         
CREATE TABLE "stock_reports" (                                                                               
  id                  TEXT PRIMARY KEY,                                                                      
  ticker              TEXT NOT NULL,                                                                         
  r2_key              TEXT NOT NULL,                                                                         
  r2_detail_key       TEXT NOT NULL DEFAULT '',                                                              
  r2_detail_zh_tw_key TEXT NOT NULL DEFAULT '',                                                              
  summary_json        TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json)),                           
  summary_json_zh_tw  TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json_zh_tw)),                     
  provenance          TEXT NOT NULL DEFAULT '',                                                              
  published_at_ms     INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),                                    
  created_at_ms       INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)                                     
);                                                                                                           
CREATE INDEX idx_stock_reports_ticker_published                                                              
  ON stock_reports(ticker, published_at_ms DESC);                                                            
CREATE TABLE subscriptions (                                                                                 
  ticker        TEXT PRIMARY KEY,                                                                            
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),                       
  created_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),                                          
  updated_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)                                           
);                                                                                                           
CREATE TRIGGER trg_subscriptions_touch_updated_at                                                            
AFTER UPDATE ON subscriptions                                                                                
FOR EACH ROW                                                                                                 
BEGIN                                                                                                        
  UPDATE subscriptions                                                                                       
  SET updated_at_ms = (unixepoch('now') * 1000)                                                              
  WHERE ticker = NEW.ticker;                                                                                 
END;                                                                                                         
CREATE TABLE technical_snapshots (                                                                           
  ticker               TEXT NOT NULL,                                                                        
  report_id            TEXT NOT NULL,                                                                        
  status               TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'failed')),     
  source               TEXT NOT NULL DEFAULT '',                                                             
  provider             TEXT NOT NULL DEFAULT '',                                                             
  r2_snapshot_key      TEXT NOT NULL DEFAULT '',                                                             
  r2_snapshot_zh_tw_key TEXT NOT NULL DEFAULT '',                                                            
  error_message        TEXT NOT NULL DEFAULT '',                                                             
  published_at_ms      INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),                                   
  updated_at_ms        INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),                                   
  PRIMARY KEY (ticker, report_id)                                                                            
);                                                                                                           
CREATE INDEX idx_technical_snapshots_report                                                                  
  ON technical_snapshots(report_id);                                                                         
CREATE TRIGGER trg_technical_snapshots_touch_updated_at                                                      
AFTER UPDATE ON technical_snapshots                                                                          
FOR EACH ROW                                                                                                 
BEGIN                                                                                                        
  UPDATE technical_snapshots                                                                                 
  SET updated_at_ms = (unixepoch('now') * 1000)                                                              
  WHERE ticker = NEW.ticker AND report_id = NEW.report_id;                                                   
END;                                                                                                         
