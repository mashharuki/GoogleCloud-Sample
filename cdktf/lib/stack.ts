import { Construct } from "constructs";
import { TerraformStack, TerraformOutput } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { CloudRunService } from "@cdktf/provider-google/lib/cloud-run-service";
import { DataGoogleServiceAccount } from "@cdktf/provider-google/lib/data-google-service-account";
import { CloudRunServiceIamPolicy } from "@cdktf/provider-google/lib/cloud-run-service-iam-policy";
import { DataGoogleIamPolicy } from "@cdktf/provider-google/lib/data-google-iam-policy";

export interface MyStackConfig {
    projectId: string;
    region: string;
    name: string;
}

/**
 * MyStack 
 */
export class MyStack extends TerraformStack {
    /**
     * コンストラクター
     * @param scope 
     * @param id 
     */
    constructor(
        scope: Construct, 
        id: string,
        config: MyStackConfig
    ) {
        super(scope, id);

        // Google Cloud プロバイダーの設定
        new GoogleProvider(this, "GoogleProvider", {
            project: config.projectId,
            region: config.region,
        });

        // サービスアカウントの作成
        const serviceAccount = new DataGoogleServiceAccount(this, "HonoSampleAccount", {
            accountId: "honoSampleAccount", // サービスアカウント名
            project: config.projectId,
        });
    
        // CloudRunに割り当てるポリシー
        const policy_data = new DataGoogleIamPolicy(this, "HonoSampleAccountIAM", {
            binding: [
              {
                role: "roles/run.invoker",
                members: [
                   `serviceAccount:${serviceAccount.email}`,
                   "allUsers" 
                ],
              }
            ],
        });
  
        // CloudRun リソース
        const cloudrunsvcapp = new CloudRunService(this, "HonoVertexAICloudRun", {
            location: config.region,
            name: config.name,
            template: {
                spec: {
                    serviceAccountName: serviceAccount.email, 
                    containers: [
                        {
                            image: `us-central1-docker.pkg.dev/${config.projectId}/${config.name}/sample:latest`,
                            ports: [{
                                containerPort: 3000
                            }]
                        },
                    ],
                },
            },
        });
      
        new CloudRunServiceIamPolicy(this, "runsvciampolicy", {
            location: config.region,
            project: cloudrunsvcapp.project,
            service: cloudrunsvcapp.name,
            policyData: policy_data.policyData,
        });

        //////////////////////////////////////////////////////////////////////
        // 成果物
        //////////////////////////////////////////////////////////////////////

        // サービスURLの出力
        new TerraformOutput(this, "service_url", {
            value: cloudrunsvcapp.status.get(0).url,
            description: "The URL of the deployed Cloud Run service"
        });

        // サービス名の出力
        new TerraformOutput(this, "service_name", {
            value: cloudrunsvcapp.name,
            description: "The name of the deployed Cloud Run service"
        });

        // リージョンの出力
        new TerraformOutput(this, "region", {
            value: cloudrunsvcapp.location,
            description: "The region where the service is deployed"
        });
    }
}