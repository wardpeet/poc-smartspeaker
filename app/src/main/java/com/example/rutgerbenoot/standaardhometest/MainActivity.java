package com.example.rutgerbenoot.standaardhometest;

import android.media.session.MediaSession;
import android.media.session.MediaSessionManager;
import android.net.Uri;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.app.MediaRouteButton;
import android.support.v7.media.MediaRouteSelector;
import android.support.v7.media.MediaRouter;
import android.support.v7.media.MediaRouter.ControlRequestCallback;
import android.view.View;
import android.widget.Button;

import com.google.android.gms.cast.CastMediaControlIntent;
import com.google.android.gms.cast.MediaInfo;
import com.google.android.gms.cast.MediaMetadata;
import com.google.android.gms.cast.framework.CastButtonFactory;
import com.google.android.gms.cast.framework.CastContext;
import com.google.android.gms.cast.framework.CastSession;
import com.google.android.gms.cast.framework.SessionManager;
import com.google.android.gms.cast.framework.media.RemoteMediaClient;
import com.google.android.gms.common.images.WebImage;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private MediaRouter mMediaRouter;
    private CastContext mCastContext;
    private MediaRouteSelector mMediaRouteSelector;
    private List<MediaRouter.RouteInfo> routes = new ArrayList<>();
    private Button mButton;
    private CastSession mCastSession;
    private SessionManager mSessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mCastContext = CastContext.getSharedInstance(this);
        mMediaRouter = MediaRouter.getInstance(this);
        mSessionManager = mCastContext.getSessionManager();

        mButton = (Button)findViewById(R.id.button_routes);
        mButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                List<MediaRouter.RouteInfo> routes = mMediaRouter.getRoutes();
                int i;
                for (i = 0; i < routes.size(); i++) {
                    if (routes.get(i).getName().equalsIgnoreCase("Huiskamer")) {
                        break;
                    }
                }
                MediaRouter.RouteInfo route = routes.get(i);
                mMediaRouter.selectRoute(route);

                mSessionManager.startSession(getIntent());
                mCastSession = mSessionManager.getCurrentCastSession();

                MediaMetadata movieMetadata = new MediaMetadata(MediaMetadata.MEDIA_TYPE_MOVIE);

                movieMetadata.putString(MediaMetadata.KEY_TITLE, "De Standaard");
                movieMetadata.putString(MediaMetadata.KEY_SUBTITLE, "Mediahuis");
                movieMetadata.addImage(new WebImage(Uri.parse("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/1200px-Big_buck_bunny_poster_big.jpg")));

                MediaInfo mediaInfo = new MediaInfo.Builder("http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4")
                        .setStreamType(MediaInfo.STREAM_TYPE_BUFFERED)
                        .setContentType("videos/mp4")
                        .setMetadata(movieMetadata)
                        .setStreamDuration(60 * 1000)
                        .build();
                RemoteMediaClient remoteMediaClient = mCastSession.getRemoteMediaClient();
                remoteMediaClient.load(mediaInfo, true, 0);
            }
        });
    }
}
