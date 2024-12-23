import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
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
  
        // CloudRun リソース
        const cloudrunsvcapp = new CloudRunService(this, "HonoVertexAICloudRun", {
            location: config.region,
            name: config.name,
            template: {
                spec: {
                    containers: [
                        {
                            image: config.name,
                        },
                    ],
                },
            },
        });

        // サービスアカウントの作成
        const serviceAccount = new DataGoogleServiceAccount(this, "HonoSampleAccount", {
            accountId: "honoSampleAccount", // サービスアカウント名
            project: config.projectId
        });
    
        // CloudRunに割り当てるポリシー
        const policy_data = new DataGoogleIamPolicy(this, "datanoauth", {
            binding: [
              {
                role: "roles/aiplatform.user",
                members: [
                   serviceAccount.accountId
                ],
              },
            ],
        });
      
        new CloudRunServiceIamPolicy(this, "runsvciampolicy", {
            location: config.region,
            project: cloudrunsvcapp.project,
            service: cloudrunsvcapp.name,
            policyData: policy_data.policyData,
        });
    }
}