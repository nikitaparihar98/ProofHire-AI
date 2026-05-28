import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter(prefix="/api/live/ws", tags=["live_ws"])

class ConnectionManager:
    def __init__(self):
        # mapping from session_id to list of WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        connections = self.active_connections.setdefault(session_id, [])
        connections.append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str):
        connections = self.active_connections.get(session_id, [])
        if websocket in connections:
            connections.remove(websocket)
        if not connections:
            # clean up empty entry
            self.active_connections.pop(session_id, None)

    async def broadcast(self, session_id: str, message: dict):
        connections = self.active_connections.get(session_id, [])
        if not connections:
            return
        data = json.dumps(message)
        for ws in connections:
            try:
                await ws.send_text(data)
            except Exception:
                # ignore broken sockets; they'll be cleaned on disconnect
                pass

manager = ConnectionManager()

@router.websocket("/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            # keep the connection alive; we don't expect inbound messages
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
    except Exception:
        manager.disconnect(websocket, session_id)

# Helper function used by live_sessions to push events
async def publish_event(
    session_id: str,
    event_type: str,
    message: str,
    severity: str,
    event_score: int,
    cumulative_score: int,
    candidate_id: str,
    auto_disqualified: bool,
):
    payload = {
        "candidate_id": candidate_id,
        "session_id": session_id,
        "timestamp": None,  # will be filled by live_sessions when broadcasting (ISO string)
        "event_type": event_type,
        "event_score": event_score,
        "cumulative_score": cumulative_score,
        "risk_level": severity,
        "message": message,
        "auto_disqualified": auto_disqualified,
    }
    # The live_sessions endpoint will replace the timestamp before calling this function
    await manager.broadcast(session_id, payload)
