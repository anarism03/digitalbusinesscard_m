import { Button, Result } from "antd";
import { Component } from "react";
import { styles } from "../../styles/shared/ErrorBoundary.styles";
import type {
  ErrorBoundaryProps as Props,
  ErrorBoundaryState as State,
} from "../../types/components/shared";

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Render xətası:", error);
  }

  handleReload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorBoundary}>
          <Result
            status="error"
            title="Nəsə yanlış getdi"
            subTitle="Səhifəni yeniləyin. Problem davam edərsə, dəstəklə əlaqə saxlayın."
            extra={
              <Button type="primary" onClick={this.handleReload}>
                Yenidən yüklə
              </Button>
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}
