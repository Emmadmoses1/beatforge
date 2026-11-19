package com.beatforge.studio;
import com.getcapacitor.BridgeActivity;
public class MainActivity extends BridgeActivity {
  @Override public void onStart() {
    super.onStart();
    try {
      android.webkit.WebView w = getBridge().getWebView();
      w.setHapticFeedbackEnabled(false);
      w.setLongClickable(false);
      w.setOnLongClickListener(v -> true);
    } catch (Exception e) {}
  }
}
